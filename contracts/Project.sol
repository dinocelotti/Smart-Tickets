pragma solidity ^0.4.2;

contract Project {
    /*
    * Staging -> The promoter is still setting up the project details
    * PrivateFunding -> Contract is Distributor and ready to sell tickets to Distributor sellers, all ticket transfers frozen
    * PublicFunding -> Contract is Distributor and ready to sell tickets to public, ticket transfers for comsums frozen
    * Done -> Sale has finished and is finalized, ticket transfers enabled for public
    */
    enum State {Staging, PrivateFunding, PublicFunding, Done}

    struct Ticket {
        uint price; //price of the ticket in wei
        uint remaining; //number of tickets left of this particular ticket
        bool created; //to check for empty values
    }
    struct User {
        bool isDistributor;
        bool initialized;
        mapping(bytes32 => uint) allottedQuantity; //number of tickets they are allowed to buy for that specific ticket type
        mapping(bytes32 => uint) markup; //percent markup on the face value for that specific ticket type
        uint promotersFee; //fee that the promoter takes from the markup
        uint ticketsBought; //total number of tickets bought for this user
    }
    State public currentState; //hold state of contract to function as state machine

    string public projectName; //name of the project to be created

    address public promoter; //wallet of the promoter
    address public membran = 0x1111111111111111111111111111111111111111; //wallet of membran, placeholder

    uint public ticketsLeft; //number of tickets left to be sold at this event
    uint public totalTickets; //total number of tickets
    uint public consumerMaxTickets; //limit of the number of tickets a non-Distributor user can own
    uint membranFee; //the fee that membran takes for this event

    mapping(address => User) users; // address of the user => user struct
    mapping(bytes32 => Ticket) tickets; //ticket type name => ticket struct
    mapping(address => mapping(bytes32 => uint)) ticketsOf; //owner => ticket type => amount
    mapping(address => mapping(bytes32 => uint[])) amountPriceListing; //seller => ticket type => [amount, price]
    mapping(address => mapping(address => mapping(bytes32 => uint[]))) amountPriceReservations; //seller => entitled => ticket type => [amount, price]
    mapping(address => uint) pendingWithdrawls; //address => withdraw amount pending

    function Project (
        string _name,
        uint _membranFee,
        uint _totalTickets,
        uint _consumerMaxTickets) public
    {
        projectName = _name;
        membranFee = _membranFee;
        ticketsLeft = _totalTickets;
        totalTickets = _totalTickets;
        consumerMaxTickets = _consumerMaxTickets;
        promoter = msg.sender;
        currentState = State.Staging;
        Created(promoter, projectName, membranFee, ticketsLeft, totalTickets, consumerMaxTickets);
    }


/**************************
        Getters
**************************/
    /**
      * @dev Checks if the tx sender is a distributor.
      * @return bool If tx sender is a distributor.
      */
    function isDistributor() constant public returns(bool) {
        return users[msg.sender].isDistributor;
    }

    /** @dev Getter for ticket values for a certain ticket type.
      * @param _ticketType Ticket type.
      * @return  Ticket type.
      * @return  Ticket price in wei of that type.
      * @return  Number of tickets left of that type.
      */
    function getTicketVals(bytes32 _ticketType) constant public returns (bytes32, uint, uint) {
        Ticket storage _t = tickets[_ticketType];
        return (_ticketType, _t.price, _t.remaining);
    }

    /** @dev A query function to return data on a user based on a ticket type
      * @param _user Address of the user to query.
      * @param _ticketType Ticket type.
      * @return  If the queried user is a distributor
      * @return  The allotted quantity of that ticket type for the user
      * @return  The markup that the distributor has placed on the face value of the ticket
      * @return  The promoter fee to be taken out of the markup
      */
    function queryUser(address _user, bytes32 _ticketType) constant public returns (bool, uint, uint, uint) {
        User storage b = users[_user];
        return (b.isDistributor, b.allottedQuantity[_ticketType], b.markup[_ticketType], b.promotersFee);
    }

    /** @dev Calculate the fraction of a value, while accounting for solidity's limitation for no fixed point values
      * @param _value Unit value to divide by
      * @param _percentage Percentage to take
      * @return  _total total value after division
      */
    function calc(uint _value, uint _percentage) public pure returns (uint _total) {
        _total = (_value * _percentage) / 100;
    }
/**************************
        Event Firers
**************************/

    event Created(address indexed promoter, string projectName, uint membranFee, uint ticketsLeft, uint totalTickets, uint consumerMaxTickets);
    event FinishStaging();
    event StartPrivateFunding();
    event StartPublicFunding();

    event AddTicket(address indexed promoter, bytes32 ticketType);
    event SetTicketPrice (address indexed promoter, bytes32 ticketType, uint priceInWei);
    event SetTicketQuantity (address indexed promoter, bytes32 ticketType, uint quantity);
    event TicketListed (address indexed seller, bytes32 ticketType, uint[] amountPrice);
    event TicketReserved(address indexed owner, address entitled, bytes32 ticketType, uint[] amountPrice);

    event AddDistributor (address indexed promoter, address distributor);
    event SetDistributorAllottedQuantity (address indexed promoter, address _distributor, bytes32 _ticketType, uint allottedQuantity);
    event SetDistributorFee (address indexed promoter, address _distributor, uint fee);

    event SetMarkup (address indexed distributor, uint _markup, bytes32 _ticketType);
    event SetUserDetails(address indexed userAddress, string name, string info);

    event BuyTicket(address indexed buyer, address indexed seller, bytes32 ticketType, uint quantity);
    event ClaimReserved(msg.sender, _seller, _ticketType, _quantity);
    event BuyTicketFromPromoter(address indexed to, address indexed from, bool indexed isDistributor, bytes32 ticketType, uint quantity, uint weiSent);
    event BuyTicketFromDistributor(address indexed from, address indexed to, bool indexed isDistributor, bytes32 ticketType,  uint quantity, uint weiSent);
    event FundsReceived(address indexed from, uint amount);

    event Withdraw(address indexed from, uint amount);

/**************************
    Phasing
**************************/

    modifier stagingPhase(){
        require(currentState == State.Staging);
        _;
    }
    modifier fundingPhase(){
        require(currentState == State.PublicFunding || currentState == State.PrivateFunding);
        _;
    }
    modifier publicFundingPhase(){
        require(currentState == State.PublicFunding);
        _;
    }
    modifier donePhase(){
        require(currentState == State.Done);
        _;
    }

    /** @dev Move state forward from staging to private funding, can only be done by the promoter */
    function finishStaging() public onlyPromoter() {
        require(ticketsLeft == 0);  //Require the promoter properly allocated all tickets into their respective types
        require(currentState == State.Staging); //Require the previous state to be Staging to move on
        currentState = State.PrivateFunding;
        FinishStaging();
    }

    /** @dev Move state forward from private funding to public funding, can only by done by the promoter */
    function startPublicFunding() public onlyPromoter() {
        require(currentState == State.PrivateFunding);
        currentState = State.PublicFunding;
        StartPublicFunding();
    }

/**************************
    Modifiers
**************************/
    modifier onlyPromoter() {
        require(msg.sender == promoter);
        _;
    }

    /**@dev An address is a valid user if they're not membran/promoter and we're in a phase where buying is valid*/
    modifier validUser() {
        //check what phase we're in and see if the user is valid for that phase
        if (!users[msg.sender].isDistributor && currentState != State.PublicFunding) 
            revert(); //if they're not a distributor (so they are an end consumer) and we're not in a public phase, throw
        if (users[msg.sender].isDistributor && currentState != State.PrivateFunding) 
            revert(); //if they are a distributor and its not the private funding phase, throw
        //make sure theyre an end comsumer or a distributor
        require(msg.sender != membran && msg.sender != promoter);
        _;
    }

    /**@dev Check if the given address parameter is a valid distributor*/
    modifier validDistributorAddress(address _distributor) {
        require(users[_distributor].isDistributor);
        _;
    }

/**************************
    Staging Phase
**************************/

    /**************************
        Ticket Setters
    **************************/
    /** @dev Add a ticket to this Project, can only be done in the staging phase and by the promoter
      * @param _ticketType Ticket type to create.
      * @param _priceInWei Price in wei to assign to this ticket type.
      * @param _quantity Number of tickets of this type
      */
    function addTicket(bytes32 _ticketType, uint _priceInWei, uint _quantity) public onlyPromoter() stagingPhase() {
        require(tickets[_ticketType].created == false); //Require that the specific ticket type hasnt been initialized yet
        tickets[_ticketType].created = true;

        AddTicket(msg.sender, _ticketType);
        setTicketPrice(_ticketType, _priceInWei);
        setTicketQuantity(_ticketType, _quantity); //Set ticket quantity for this type, drawing from the total ticket pool
    }
    
    /** @dev Set the ticket price, can only be done in the staging phase and by the promoter
      * @param _ticketType Ticket type to create.
      * @param _priceInWei The price of the ticket to set
      */
    function setTicketPrice(bytes32 _ticketType, uint _priceInWei) public onlyPromoter() stagingPhase() {
        require(tickets[_ticketType].created == true);
        require(_priceInWei >= 0);
        tickets[_ticketType].price = _priceInWei; //Set the price of the ticket of that type
        SetTicketPrice(msg.sender, _ticketType, _priceInWei);
    }

    /** @dev Set the ticket quantity of that type, can only be done in the staging phase and by the promoter
      * @param _ticketType Ticket type to create.
      * @param _quantity The quantity of tickets to set
      */
    function setTicketQuantity(bytes32 _ticketType, uint _quantity) public onlyPromoter() stagingPhase() {
        require(ticketsLeft >= _quantity); //require quantity wont be over the total ticket pool
        require(tickets[_ticketType].created == true);
        tickets[_ticketType].remaining = _quantity;
        ticketsLeft -= _quantity; //reduce the total ticket pool by quantity

        SetTicketQuantity(msg.sender, _ticketType, _quantity);
    }

    /**************************
        Distributor Setters
    **************************/
    /** @dev Add a user as a distributor, can only be done by the promoter and in staging phase
      * @param _user Address of the user
      */
    function addDistributor(address _user) public onlyPromoter() stagingPhase() {
        require(_user != promoter);
        if (users[_user].isDistributor == true) 
            return;     //dont want to throw, just return early instead
        users[_user].isDistributor = true;
        AddDistributor(msg.sender, _user);
    }

    /** @dev Set the alloted quantity of a ticket for a distributor, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _ticketType The ticket type
      * @param _quantity Quantity of tickets
      */
    function setDistributorAllottedQuantity(address _distributor, bytes32 _ticketType, uint _quantity) public onlyPromoter() stagingPhase() {
        require(tickets[_ticketType].remaining >= _quantity); //check for sufficient tickets of that type
        require(users[_distributor].isDistributor); //make sure this user is a distributor

        users[_distributor].allottedQuantity[_ticketType] = _quantity;

        SetDistributorAllottedQuantity(msg.sender, _distributor, _ticketType, _quantity);
    }

    /** @dev Set the promoters fee for the distributors markup on the tickets, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _promotersFee The fee in percent to set for the distributor
      */
    function setDistributorFee(address _distributor, uint _promotersFee) public onlyPromoter() stagingPhase() {
        require(users[_distributor].isDistributor); //make sure this user is a distributor

        users[_distributor].promotersFee = _promotersFee;

        SetDistributorFee(msg.sender, _distributor, _promotersFee);
    }

    /** @dev Set the markup on the face value of the ticket for the distributor, can only be done in the staging phase and by the distributor
      * @param _markup The address of the distributor.
      * @param _ticketType The ticket type
      */
    function setMarkup(uint _markup, bytes32 _ticketType) public validDistributorAddress(msg.sender) stagingPhase() {
        users[msg.sender].markup[_ticketType] = _markup;

        SetMarkup(msg.sender, _markup, _ticketType);
    }

    /**@dev Caller lists an amount of tickets (that they own) for sale at a specific price
     * @param _ticketType The type of ticket to be listed
     * @param _amountPrice Array with: index 0 = amount for sale | index 1 = price of ticket
     */
    function listTicket(bytes32 _ticketType, uint[] _amountPrice) public {
        require(_amountPrice[0] > 0 && _amountPrice[1] >= 0);
        require(tickets[_ticketType].created == true);
        require(ticketsOf[msg.sender][_ticketType] >= _amountPrice[0]);

        ticketsOf[msg.sender][_ticketType] -= _amountPrice[0];
        amountPriceListing[msg.sender][_ticketType] = _amountPrice;
        TicketListed(msg.sender, _ticketType, _amountPrice);
    }

    /**@dev Caller cancels their sales of all listed tickets of this type
     * and returns the tickets to the caller's ownership
     * @param _ticketType The ticket type to cancel
     */
    function cancelListing(bytes32 _ticketType) public {
        require(amountPriceListing[msg.sender][_ticketType][0] > 0);

        ticketsOf[msg.sender][_ticketType] = amountPriceListing[msg.sender][_ticketType][0];
        amountPriceListing[msg.sender][_ticketType] = [0, 0];
        TicketListed(msg.sender, _ticketType, [0,0]);
    }

    /**@dev Caller reserves an amount of tickets at a price for an entitled address
     * @param _entitled The address for whom the tickets are reserved
     * @param _ticketType The type of ticket to reserve
     * @param _amountPrice The amount and price to reserve
     */
    function reserveTicket(address _entitled, bytes32 _ticketType, uint[] _amountPrice) public {
        require(_amountPrice[0] > 0 && _amountPrice[1] >= 0);
        require(tickets[_ticketType].created == true);
        require(ticketsof[msg.sender][_ticketType] >= _amountPrice[0]);

        ticketsOf[msg.sender][_ticketType] -= _amountPrice[0];
        amountPriceReservations[msg.sender][_entitled][_ticketType] = _amountPrice;
        TicketReserved(msg.sender, _entitled, _ticketType, _amountPrice);
    }

    /**@dev Caller cancels all reserved tickets (of a given type) for an address
     * @param _entitled The address for whom the tickets are reserved
     * @param _ticketType The type of ticket to cancel
     */
    function cancelReservations(address _entitled, bytes32 _ticketType) public {
        require(amountPriceReservations[msg.sender][_entitled][_ticketType][0] > 0);

        ticketsOf[msg.sender][_ticketType] = amountPriceReservations[msg.sender][_entitled][_ticketType][0];
        amountPriceReservations[msg.sender][_entitled][_ticketType] = [0, 0];
        TicketReserved(msg.sender, _entitled, _ticketType, [0, 0]);
    }

    /**************************
        Payable functions
    **************************/

    /** @dev Universal transaction function for any purchase
      * @param _seller address of the user who has listed these tickets for sale
      * @param _ticketType type of the ticket to purchase
      * @param _quantity amount to purchase
      */
    function buyTicket(address _seller, bytes32 _ticketType, uint _quantity) public payable {

        //CONDITION CHECKS
        //  A positive amount has been requested
        //  Ticket type is valid
        //  Seller has enough tickets listed
        require(_quantity > 0);
        require(tickets[_ticketType].created == true);
        require(amountPriceListing[_seller][_ticketType][0] >= _quantity);

        //Calculate total cost of purchase and ensure that buyer has payed enough
        uint netCost = amountPriceListing[_seller][_ticketType][1] * _quantity;
        uint change = msg.value - netCost;
        require(change >= 0);

        //If buyer is not a distributor, check they will not exceed consumer limit
        if (!users[msg.sender].isDistributor &&
            users[msg.sender].ticketsBought + _quantity > consumerMaxTickets) {
            revert();
        } else {
            users[msg.sender].ticketsBought += _quantity;
        }

        //If buyer is distributor, check they will not exceed allotted amount for this type
        if (users[msg.sender].isDistributor &&
            (users[msg.sender].allottedQuantity[_ticketType] >= _quantity))
        {
            revert();
        } else {
            users[msg.sender].allottedQuantity[_ticketType] -= _quantity;
        }

        //Transfer tickets
        amountPriceListing[_seller][_ticketType][0] -= _quantity;
        ticketsOf[msg.sender][_ticketType] += _quantity;

        //Split payments
        pendingWithdrawls[msg.sender] += change;
        pendingWithdrawls[_seller] += netCost;

        FundsReceived(msg.sender, change);
        FundsReceived(_seller, netCost);

        BuyTicket(msg.sender, _seller, _ticketType, _quantity);
    }

    /** @dev Function for claiming tickets that are reserved for the caller. Caller may decide to take 
      * all of the tickets that they are entitled to, or just some.
      * @param _seller address of the original owner of the tickets, who placed the reservation
      * @param _ticketType type of the ticket to be claimed
      * @param _quantity amount of tickets to be claimed
      */
    function claimReserved(address _seller, bytes32 _ticketType, uint _quantity) public payable {
        require(_quantity > 0);
        require(tickets[_ticketType].created == true);
        require(amountPriceReservations[_seller][msg.sender][_ticketType][0] >= _quantity);

        //Calculate total cost of purchase and ensure that buyer has payed enough
        int netCost = amountPriceReservations[_seller][msg.sender][_ticketType][1] * _quantity;
        int change = msg.value - netCost;
        require(change >= 0);
        
        //If buyer is not a distributor, check they will not exceed consumer limit
        if (!users[msg.sender].isDistributor &&
            users[msg.sender].ticketsBought + _quantity > consumerMaxTickets) {
            revert();
        } else {
            users[msg.sender].ticketsBought += _quantity;
        }

        //If buyer is distributor, check they will not exceed allotted amount for this type
        if (users[msg.sender].isDistributor &&
            (users[msg.sender].allottedQuantity[_ticketType] >= _quantity))
        {
            revert();
        } else {
            users[msg.sender].allottedQuantity[_ticketType] -= _quantity;
        }

        //Transfer tickets
        amountPriceReservation[_seller][msg.sender][_ticketType][0] -= _quantity;
        ticketsOf[msg.sender][_ticketType] += _quantity;

        //Split payments
        pendingWithdrawls[msg.sender] += change;
        pendingWithdrawls[_seller] += netCost;

        FundsReceived(msg.sender, change);
        FundsReceived(_seller, netCost);

        ClaimReserved(msg.sender, _seller, _ticketType, _quantity);
    }

    /** @dev Allow purchases from the promoter given that it's a valid user (distributor/end-consumer) and valid phase (public/private funding)
      * @param _ticketType The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromPromoter(bytes32 _ticketType, uint _quantity) public payable
    validUser() fundingPhase() 
    {
        User storage _user = users[msg.sender];

        //CONDITION CHECKS
        //  A positive amount has been requested
        //  Ticket type is valid
        //  Promoter has enough tickets of this type remaining
        require(_quantity > 0);
        require(tickets[_ticketType].created == true);
        require(tickets[_ticketType].remaining >= _quantity);

        //  If buyer is not a distributor, check they will not exceed consumer limit
        if (!_user.isDistributor &&
            _user.ticketsBought + _quantity > 
            consumerMaxTickets) 
            revert();

        //  If buyer is distributor, check they will not exceed allotted amount for this type
        if (_user.isDistributor &&
            (ticketsOf[msg.sender][_ticketType] + _quantity >
            _user.allottedQuantity[_ticketType])) 
            revert();

        int _total = tickets[_ticketType].price * _quantity; //calculate total price
        int _netValue = msg.value - _total; //subtract total price from ether sent
        int _membranFee = calc(_total, membranFee); //calculate membran's fee

        require(_netValue >= 0); //make sure user paid enough

        //EFFECTS
        ticketsOf[msg.sender][_ticketType] += _quantity; //add the tickets bought to the user for that ticket type
        _user.ticketsBought += _quantity; //add to the total tickets bought for that user
        tickets[_ticketType].remaining -= _quantity; //subtract remaining quantity from pool of that ticket type

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;
        pendingWithdrawls[membran] += _membranFee;
        pendingWithdrawls[promoter] += _total - _membranFee;

        //alert of funds split
        FundsReceived(msg.sender, _netValue);
        FundsReceived(membran, _membranFee);
        FundsReceived(promoter, _total - _membranFee);


        BuyTicketFromPromoter(msg.sender, promoter, _user.isDistributor, _ticketType, _quantity, msg.value);
    }

    /** @dev Allow purchases from the distributor given that it's a valid user (end-consumer only) and valid phase (public funding)
      * @param _ticketType The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromDistributor(address _distributor, bytes32 _ticketType, uint _quantity) public payable
    validDistributorAddress(_distributor) publicFundingPhase() 
    {
        User storage _user = users[msg.sender];

        //CONDITION CHECKS
        //  Buyer is an end consumer
        //  A positive amount has been resquested
        //  Ticket type is valid
        //  Distributor owns enough tickets of that type to sell to the user
        //  Buyer will not go over the consumer limit
        require(msg.sender != membran && msg.sender != promoter && !_user.isDistributor);
        require(_quantity > 0);
        require(tickets[_ticketType].created == true);
        require(ticketsOf[_distributor][_ticketType] >= _quantity);
        require (_user.ticketsBought + _quantity <= consumerMaxTickets);

        uint _faceValue = tickets[_ticketType].price * _quantity; //calculate the total face value based on the quantity
        uint _markup = calc(_faceValue, users[_distributor].markup[_ticketType]); //calculate the markup price over the face value
        uint _total = _faceValue + _markup; //calculate total price
        uint _netValue = msg.value - _total;  //subtract total price from ether sent
        uint _promotersFee = calc(_markup, users[_distributor].promotersFee); //calculate promoters fee on the markup of the distributor

        require(_netValue >= 0); //make sure user paid enough

        //EFFECTS
        ticketsOf[msg.sender][_ticketType] += _quantity; //add ticket ownership to buyer address
        _user.ticketsBought += _quantity; //add the tickets bought to the users total tickets bought
        users[_distributor].allottedQuantity[_ticketType] -= _quantity; //subtract tickets bought from Distributor seller

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;     // "Change" leftover from transaction
        pendingWithdrawls[promoter] += _promotersFee;
        pendingWithdrawls[_distributor] += _total - _promotersFee;

        //alert of funds split
        FundsReceived(msg.sender, _netValue);
        FundsReceived(promoter, _promotersFee);
        FundsReceived(_distributor, _total - _promotersFee);

        BuyTicketFromDistributor(_distributor, msg.sender, users[msg.sender].isDistributor, _ticketType, _quantity, msg.value);
    }
/**************************
Done Phase - Withdrawls
**************************/
    function withdraw() public donePhase() {
        uint amount = pendingWithdrawls[msg.sender];
        pendingWithdrawls[msg.sender] = 0;
        msg.sender.transfer(amount);
        Withdraw(msg.sender, amount);
    }
}