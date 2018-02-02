pragma solidity ^0.4.2;


contract Project {

    /*
    * Staging -> The promoter is still setting up the project details
    * PrivateFunding -> Contract is Distributor and ready to sell tickets to Distributor sellers, all ticket transfers frozen
    * Public -> Contract is Distributor and ready to sell tickets to public, ticket transfers for comsums frozen
    * Done -> Sale has finished and is finalized, ticket transfers enabled for public
    */
    enum State {Staging, Public, Done}

    struct Ticket {
        uint total; //Sum of all created of this ticket type
        uint faceValue; //Set by promoter to act as the "regular" price
        uint maxPrice; //Upper bound on price of ticket, 0 if none
        bool created; //to check for empty values
    }

    struct User {
        bool isDistributor;
        bool initialized;
        mapping(bytes32 => uint) allowance; //number of tickets they are allowed to buy for that specific ticket type
        mapping(bytes32 => uint) markup; //percent markup on the face value for that specific ticket type
        uint promotersFee; //fee that the promoter takes from the markup
        uint ticketsBought; //total number of tickets bought for this user
    }

    State public currentState; //hold state of contract to function as state machine

    string public projectName; //name of the project to be created

    address public promoter; //wallet of the promoter
    address public membran = 0x1111111111111111111111111111111111111111; //wallet of membran, placeholder

    uint public totalTickets; //total number of tickets
    uint public consumerMaxTickets; //limit of the number of tickets a non-Distributor user can own

    mapping(address => User) users; // address of the user => user struct
    mapping(bytes32 => Ticket) tickets; //ticket type name => ticket struct
    mapping(address => mapping(bytes32 => uint)) ticketsOfAddr; //owner => ticket type => amount

    mapping(address => mapping(bytes32 => uint[2])) amountPriceListing; //seller => ticket type => [amount, price]
    mapping(address => mapping(address => mapping(bytes32 => uint[2]))) amountPriceReservations; //seller => entitled => ticket type => [amount, price]
   
    mapping(address => uint) pendingWithdrawls; //address => withdraw amount pending

    function Project (
        string _name,
        uint _consumerMaxTickets) public
    {
        projectName = _name;
        consumerMaxTickets = _consumerMaxTickets;
        promoter = msg.sender;
        currentState = State.Staging;
        Created(
            promoter, 
            projectName, 
            consumerMaxTickets);
    }

/**************************
        Getters
**************************/

    /**
      * @dev Checks if the user is a distributor.
      * @return bool If user is a distributor.
      */      
    function isDistributor(address _user) public constant returns(bool) {        
        return users[_user].isDistributor;
    }

    /// @notice Get number of a ticket type owned by an address 
    function getOwnings(address _user, bytes32 _ticketType) public view returns (uint) {
        return ticketsOfAddr[_user][_ticketType];
    }

    /// @notice Get amount and price of a ticket type listed by a seller
    function getAddrListing(address _seller, bytes32 _ticketType) public view returns (uint[2]) {
        return amountPriceListing[_seller][_ticketType];
    }

    /// @notice Get amount and price of a ticket type reserved by a seller for an entitled user
    function getAddrReserFor(address _seller, address _entitled, bytes32 _ticketType) public view returns (uint[2]) {
        return amountPriceReservations[_seller][_entitled][_ticketType];
    }

    /** @dev Getter for ticket values for a certain ticket type.
      * @param _ticketType Ticket type.
      * @return  Ticket type.
      * @return  Ticket price in wei of that type.
      * @return  Number of tickets left of that type.
      */
    function getTicketVals(bytes32 _ticketType) public constant returns (bytes32, uint, uint, uint) {
        Ticket storage myType = tickets[_ticketType];
        return (_ticketType, myType.faceValue, myType.maxPrice, myType.total);
    }

    /** @dev A query function to return data on a user based on a ticket type
      * @param _user Address of the user to query.
      * @param _ticketType Ticket type.
      * @return  If the queried user is a distributor
      * @return  The allotted quantity of that ticket type for the user
      * @return  The markup that the distributor has placed on the face value of the ticket
      * @return  The promoter fee to be taken out of the markup
      */
    function queryUser(address _user, bytes32 _ticketType) public constant returns (bool, uint, uint, uint) {
        User storage b = users[_user];
        return (b.isDistributor, b.allowance[_ticketType], b.markup[_ticketType], b.promotersFee);
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

    event Created (
        address indexed promoter, 
        string projectName,
        uint consumerMaxTickets);
    event StartPublicFunding ();

    event AddTicket (bytes32 ticketType, uint faceValue, uint maxPrice, uint quantity);
    event TicketListed (address indexed seller, bytes32 ticketType, uint[2] amountPrice);
    event TicketReserved (address indexed owner, address entitled, bytes32 ticketType, uint[2] amountPrice);

    event AddDistributor (address distributor);
    event GiveAllowance (address distributor, bytes32 ticketType, uint allowance);

    event SetDistributorFee (address indexed promoter, address _distributor, uint fee);

    event SetMarkup (address indexed distributor, uint _markup, bytes32 _ticketType);
    event SetUserDetails (address indexed userAddress, string name, string info);

    event BuyTicket (address indexed buyer, address indexed seller, bytes32 ticketType, uint quantity);

    event ClaimReserved (
        address indexed buyer, 
        address indexed seller, 
        bytes32 ticketType, 
        uint quantity);

    event FundsReceived (address indexed from, uint amount);
    event Withdraw (address indexed from, uint amount);

/**************************
    Phasing
**************************/


    modifier stagingPhase(){
        require(currentState == State.Staging);
        _;
    }

    modifier publicFundingPhase(){
        require(currentState == State.Public);
        _;
    }

    modifier donePhase(){
        require(currentState == State.Done);
        _;
    }

    /** @dev Move state forward from staging to private funding, can only be done by the promoter */
    function finishStaging() public onlyPromoter() stagingPhase() {
        currentState = State.Public;
        StartPublicFunding();
    }

/**************************
    Modifiers
**************************/
    modifier onlyPromoter() {
        require(msg.sender == promoter);
        _;
    }

    /**@dev Check if the given address parameter is a valid distributor*/
    modifier onlyDistributor(address _distributor) {
        require(users[_distributor].isDistributor);
        _;
    }

    /**@dev An address is a valid user if they're not membran/promoter and we're in a phase where buying is valid*/
    modifier validUser() {
        //check what phase we're in and see if the user is valid for that phase
        if (!users[msg.sender].isDistributor && currentState != State.Public) 
            revert(); //if they're not a distributor (so they are an end consumer) and we're not in a public phase, throw
        //make sure theyre an end comsumer or a distributor
        require(msg.sender != membran && msg.sender != promoter);
        _;
    }

/**************************
    Distributor Setters
**************************/
    /** @dev Add a user as a distributor, can only be done by the promoter and in staging phase
      * @param _user Address of the user
      */
    function addDistributor(address _user) public onlyPromoter() {
        require(_user != promoter);
        if (users[_user].isDistributor == true) 
            return;     //dont want to throw, just return early instead
        users[_user].isDistributor = true;
        AddDistributor(_user);
    }

    /** @dev Set the alloted quantity of a ticket for a distributor, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _ticketType The ticket type
      * @param _quantity Quantity of tickets
      */
    function giveAllowance(address _distributor, bytes32 _ticketType, uint _quantity) public 
    onlyPromoter()
    onlyDistributor(_distributor)
    {
        users[_distributor].allowance[_ticketType] += _quantity;
        GiveAllowance(_distributor, _ticketType, _quantity);
    }

    /** @dev Set the promoters fee for the distributors markup on the tickets, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _promotersFee The fee in percent to set for the distributor
      */
    function setDistributorFee(address _distributor, uint _promotersFee) public onlyPromoter() {
        require(users[_distributor].isDistributor); //make sure this user is a distributor

        users[_distributor].promotersFee = _promotersFee;

        SetDistributorFee(msg.sender, _distributor, _promotersFee);
    }

    /** @dev Set the markup on the face value of the ticket for the distributor, can only be done in the staging phase and by the distributor
      * @param _markup The address of the distributor.
      * @param _ticketType The ticket type
      */
    function setMarkup(uint _markup, bytes32 _ticketType) public onlyDistributor(msg.sender) {
        users[msg.sender].markup[_ticketType] = _markup;

        SetMarkup(msg.sender, _markup, _ticketType);
    }

    /** @dev Add a ticket to this Project, can only be done in the staging phase and by the promoter
      * @param _ticketType Ticket type to create.
      * @param _faceValue Promoter's suggested price
      * @param _maxPrice Promoter's max price
      * @param _quantity Number of tickets of this type
      */
    function addTicket(bytes32 _ticketType, uint _faceValue, uint _maxPrice, uint _quantity) public onlyPromoter() {
        // Ensure that the attributes for this type are set
        tickets[_ticketType].created = true;
        tickets[_ticketType].total += _quantity;
        tickets[_ticketType].faceValue = _faceValue;
        tickets[_ticketType].maxPrice = _maxPrice;

        //Give the promoter ownership over the new tickets
        ticketsOfAddr[promoter][_ticketType] += _quantity;

        totalTickets += _quantity;

        AddTicket(_ticketType, _faceValue, _maxPrice, _quantity);
    }

    /**@dev Caller lists an amount of tickets (that they own) for sale at a specific price
     * @param _ticketType The type of ticket to be listed
     * @param _amountPrice Array with: index 0 = amount for sale | index 1 = price of ticket
     */
    function listTicket(bytes32 _ticketType, uint[2] _amountPrice) public {
        require(_amountPrice[0] > 0 && _amountPrice[1] >= 0);
        require(tickets[_ticketType].created == true);
        require(ticketsOfAddr[msg.sender][_ticketType] >= _amountPrice[0]);

        ticketsOfAddr[msg.sender][_ticketType] -= _amountPrice[0];
        amountPriceListing[msg.sender][_ticketType] = _amountPrice;
        TicketListed(msg.sender, _ticketType, _amountPrice);
    }

    /**@dev Caller cancels their sales of all listed tickets of this type
     * and returns the tickets to the caller's ownership
     * @param _ticketType The ticket type to cancel
     */
    function cancelListing(bytes32 _ticketType) public {
        require(amountPriceListing[msg.sender][_ticketType][0] > 0);

        ticketsOfAddr[msg.sender][_ticketType] = amountPriceListing[msg.sender][_ticketType][0];
        amountPriceListing[msg.sender][_ticketType] = [0, 0];
        TicketListed(msg.sender, _ticketType, amountPriceListing[msg.sender][_ticketType]);
    }

    /**@dev Caller reserves an amount of tickets at a price for an entitled address
     * @param _entitled The address for whom the tickets are reserved
     * @param _ticketType The type of ticket to reserve
     * @param _amountPrice The amount and price to reserve
     */
    function reserveTicket(address _entitled, bytes32 _ticketType, uint[2] _amountPrice) public {
        require(_amountPrice[0] > 0 && _amountPrice[1] >= 0);
        require(tickets[_ticketType].created == true);
        require(ticketsOfAddr[msg.sender][_ticketType] >= _amountPrice[0]);

        if (msg.sender == promoter && users[_entitled].isDistributor) {
            giveAllowance(_entitled, _ticketType, _amountPrice[0]);
        }

        ticketsOfAddr[msg.sender][_ticketType] -= _amountPrice[0];
        amountPriceReservations[msg.sender][_entitled][_ticketType] = _amountPrice;
        TicketReserved(msg.sender, _entitled, _ticketType, _amountPrice);
    }

    /**@dev Caller cancels all reserved tickets (of a given type) for an address
     * @param _entitled The address for whom the tickets are reserved
     * @param _ticketType The type of ticket to cancel
     */
    function cancelReservation(address _entitled, bytes32 _ticketType) public {
        require(amountPriceReservations[msg.sender][_entitled][_ticketType][0] > 0);

        ticketsOfAddr[msg.sender][_ticketType] = amountPriceReservations[msg.sender][_entitled][_ticketType][0];
        amountPriceReservations[msg.sender][_entitled][_ticketType] = [0, 0];
        TicketReserved(msg.sender, _entitled, _ticketType, amountPriceReservations[msg.sender][_entitled][_ticketType]);
    }

/**************************
    Payable functions
**************************/

    /** @dev Universal transaction function for any purchase
      * @param _seller address of the user who has listed these tickets for sale
      * @param _ticketType type of the ticket to purchase
      * @param _quantity amount to purchase
      */
    function buyTicket(address _seller, bytes32 _ticketType, uint _quantity) public payable publicFundingPhase() {

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
            (users[msg.sender].allowance[_ticketType] >= _quantity))
        {
            revert();
        } else {
            users[msg.sender].allowance[_ticketType] -= _quantity;
        }

        //Transfer tickets
        amountPriceListing[_seller][_ticketType][0] -= _quantity;
        ticketsOfAddr[msg.sender][_ticketType] += _quantity;

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
    function claimReserved(address _seller, bytes32 _ticketType, uint _quantity) public payable publicFundingPhase() {
        require(_quantity > 0);
        require(tickets[_ticketType].created == true);
        require(amountPriceReservations[_seller][msg.sender][_ticketType][0] >= _quantity);

        //Calculate total cost of purchase and ensure that buyer has payed enough
        uint netCost = amountPriceReservations[_seller][msg.sender][_ticketType][1] * _quantity;
        require(msg.value - netCost >= 0);
        uint change = msg.value - netCost;
        
        //If buyer is not a distributor, check they will not exceed consumer limit
        if (!users[msg.sender].isDistributor &&
            users[msg.sender].ticketsBought + _quantity > consumerMaxTickets) {
            revert();
        } else {
            users[msg.sender].ticketsBought += _quantity;
        }

        //If buyer is distributor, check they will not exceed allotted amount for this type
        if (users[msg.sender].isDistributor &&
            (users[msg.sender].allowance[_ticketType] >= _quantity))
        {
            revert();
        } else {
            users[msg.sender].allowance[_ticketType] -= _quantity;
        }

        //Transfer tickets
        amountPriceReservations[_seller][msg.sender][_ticketType][0] -= _quantity;
        ticketsOfAddr[msg.sender][_ticketType] += _quantity;

        //Split payments
        pendingWithdrawls[msg.sender] += change;
        pendingWithdrawls[_seller] += netCost;

        FundsReceived(msg.sender, change);
        FundsReceived(_seller, netCost);

        ClaimReserved(msg.sender, _seller, _ticketType, _quantity);
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