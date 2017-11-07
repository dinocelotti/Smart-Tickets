pragma solidity ^0.4.2;

contract Project {
    /*
    * Staging -> The promoter is still setting up the project details
    * PrivateFunding -> Contract is Distributor and ready to sell tickets to Distributor sellers, all ticket transfers frozen
    * PublicFunding -> Contract is Distributor and ready to sell tickets to public, ticket transfers for comsums frozen
    * Done -> Sale has finished and is finalized, ticket transfers enabled for public
    */
    enum State {Staging, PrivateFunding, PublicFunding, Done}

    //see https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes/17112
    //for details on 32 byte IPFS hash
    struct Ticket {
        uint price; //price of the ticket in wei
        uint remaining; //number of tickets left of this particular ticket
        bool created; //to check for empty values
        bytes32 ipfsHash; //IPFS hash linking to off-chain ticket details
    }
    struct User {
        bool isDistributor;
        bool initialized;
        mapping(uint => uint) allottedQuantity; //number of tickets they are allowed to buy for that specific ticket type
        mapping(uint => uint) markup; //percent markup on the face value for that specific ticket type
        uint promotersFee; //fee that the promoter takes from the markup
        bytes32 ipfsHash; //hash linking to users profile, if any
        uint ticketsBought; //total number of tickets bought for this user
        string name; //to be converted to an IPFS hash for off-chain storage
        string info; //to be converted to an IPFS hash for off-chain storage
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
    mapping(uint => Ticket) tickets; // type of ticket => ticket struct
    mapping(address => mapping(uint => uint)) ticketsOf; // address => type of ticket => quantity of tickets that address owns
    mapping(address => uint) pendingWithdrawls; //address => withdraw amount pending

    function Project(
        string _name,
        uint _membranFee,
        uint _totalTickets,
        uint _consumerMaxTickets) {
            projectName = _name;
            membranFee = _membranFee;
            ticketsLeft = _totalTickets;
            totalTickets= _totalTickets;
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
    function isDistributor() constant returns(bool) {
        return users[msg.sender].isDistributor;
    }

    /** @dev Getter for ticket values for a certain ticket type.
      * @param _ticketType Ticket type.
      * @return  Ticket type.
      * @return  Ticket price in wei of that type.
      * @return  Number of tickets left of that type.
      */
    function getTicketVals(uint _ticketType) constant returns (uint, uint, uint){
        Ticket _t = tickets[_ticketType];
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
    function queryUser(address _user, uint _ticketType) constant returns (bool, uint, uint, uint){
        User b = users[_user];
        return (b.isDistributor, b.allottedQuantity[_ticketType], b.markup[_ticketType], b.promotersFee);
    }

    function getUserInfo(address user) constant returns (string, string) {
            return (users[user].name, users[user].info);
    }

/**************************
        Event Firers
**************************/

     event Created(address indexed promoter, string projectName, uint membranFee, uint ticketsLeft, uint totalTickets, uint consumerMaxTickets);
     event FinishStaging();
     event StartPrivateFunding();
     event StartPublicFunding();

     event AddTicket(address indexed promoter, uint typeOfTicket);
     event AddIpfsDetailsToTicket(address indexed promoter, uint typeOfTicket, bytes32 ipfsHash);
     event SetTicketPrice (address indexed promoter, uint typeOfTicket, uint priceInWei);
     event SetTicketQuantity (address indexed promoter, uint typeOfTicket, uint quantity);


     event AddDistributor (address indexed promoter, address distributor);
     event SetDistributorAllottedQuantity (address indexed promoter, address _distributor, uint _typeOfTicket, uint allottedQuantity);
     event SetDistributorFee (address indexed promoter, address _distributor, uint fee);

     event SetMarkup (address indexed distributor, uint _markup, uint _typeOfTicket);
     event SetUserDetails(address indexed userAddress, string name, string info);

     event BuyTicketFromPromoter(address indexed to, address indexed from, bool indexed isDistributor, uint typeOfTicket, uint quantity, uint weiSent);
     event BuyTicketFromDistributor(address indexed from, address indexed to, bool indexed isDistributor, uint typeOfTicket,  uint quantity, uint weiSent);
     event FundsReceived(address indexed from, uint amount);

     event Withdraw(address indexed from, uint amount);

/**************************
    Phase Modifiers
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

/**************************
    Phase Setters
**************************/
    /** @dev Move state forward from staging to private funding, can only be done by the promoter */
     function finishStaging() onlyPromoter() {
         require(ticketsLeft == 0);  //Require the promoter properly allocated all tickets into their respective types
         require(currentState == State.Staging); //Require the previous state to be Staging to move on
         currentState = State.PrivateFunding;
         FinishStaging();
     }

    /** @dev Move state forward from private funding to public funding, can only by done by the promoter */
     function startPublicFunding() onlyPromoter() {
         require(currentState == State.PrivateFunding);
         currentState = State.PublicFunding;
         StartPublicFunding();
     }

/**************************
    Access Modifiers
**************************/
    modifier onlyPromoter() {
        require(msg.sender == promoter);
        _;
    }
    modifier onlyDistributor(){
        require(users[msg.sender].isDistributor);
        _;
    }

/**************************
    Staging Phase
**************************/

    /**************************
        Ticket Setters
    **************************/
    /** @dev Add a ticket to this Project, can only be done in the staging phase and by the promoter
      * @param _typeOfTicket Ticket type to create.
      * @param _priceInWei Price in wei to assign to this ticket type.
      * @param _quantity Number of tickets of this type
      */
    function addTicket(uint _typeOfTicket, uint _priceInWei, uint _quantity) onlyPromoter() stagingPhase(){
        require(tickets[_typeOfTicket].created == false); //Require that the specific ticket type hasnt been initialized yet
        tickets[_typeOfTicket].created = true;

        AddTicket(msg.sender, _typeOfTicket);
        setTicketPrice(_typeOfTicket, _priceInWei);
        setTicketQuantity(_typeOfTicket, _quantity); //Set ticket quantity for this type, drawing from the total ticket pool
    }
    /** @dev Add a ipfs hash to a ticket to store off-chain data, can only be done in the staging phase and by the promoter
      * @param _typeOfTicket Ticket type to create.
      * @param _hash The ipfs hash to add
      */
    function addIpfsDetailsToTicket(uint _typeOfTicket, bytes32 _hash) onlyPromoter() stagingPhase(){
        require(tickets[_typeOfTicket].created == true); //Require that the ticket type has been made already
        tickets[_typeOfTicket].ipfsHash = _hash; //Add the hash
        AddIpfsDetailsToTicket(msg.sender, _typeOfTicket, _hash);
    }
    /** @dev Set the ticket price, can only be done in the staging phase and by the promoter
      * @param _typeOfTicket Ticket type to create.
      * @param _priceInWei The price of the ticket to set
      */
    function setTicketPrice(uint _typeOfTicket, uint _priceInWei) onlyPromoter() stagingPhase() {
        require(tickets[_typeOfTicket].created == true);
        require(_priceInWei >= 0);
        tickets[_typeOfTicket].price = _priceInWei; //Set the price of the ticket of that type
        SetTicketPrice(msg.sender, _typeOfTicket, _priceInWei);
    }

    /** @dev Set the ticket quantity of that type, can only be done in the staging phase and by the promoter
      * @param _typeOfTicket Ticket type to create.
      * @param _quantity The quantity of tickets to set
      */
    function setTicketQuantity(uint _typeOfTicket, uint _quantity) onlyPromoter() stagingPhase() {
        require(ticketsLeft >= _quantity); //require quantity wont be over the total ticket pool
        require(tickets[_typeOfTicket].created == true);
        tickets[_typeOfTicket].remaining = _quantity;
        ticketsLeft -= _quantity; //reduce the total ticket pool by quantity

        SetTicketQuantity(msg.sender, _typeOfTicket, _quantity);
    }

    /**************************
        Distributor Setters
    **************************/
    /** @dev Add a user as a distributor, can only be done by the promoter and in staging phase
      * @param _user Address of the user
      */
    function addDistributor(address _user) onlyPromoter() stagingPhase() {
        require(_user != promoter);
        if(users[_user].isDistributor == true) return; //dont want to throw, just return early instead
        users[_user].isDistributor = true;
        AddDistributor(msg.sender, _user);
    }

    /** @dev Set the alloted quantity of a ticket for a distributor, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _typeOfTicket The ticket type
      * @param _quantity Quantity of tickets
      */
    function setDistributorAllottedQuantity(address _distributor, uint _typeOfTicket, uint _quantity) onlyPromoter() stagingPhase() {
        require(tickets[_typeOfTicket].remaining >= _quantity); //check for sufficient tickets of that type
        require(users[_distributor].isDistributor); //make sure this user is a distributor

        users[_distributor].allottedQuantity[_typeOfTicket] = _quantity;

        SetDistributorAllottedQuantity(msg.sender, _distributor, _typeOfTicket, _quantity);
    }

    /** @dev Set the promoters fee for the distributors markup on the tickets, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _promotersFee The fee in percent to set for the distributor
      */
    function setDistributorFee(address _distributor, uint _promotersFee) onlyPromoter() stagingPhase() {
        require(users[_distributor].isDistributor); //make sure this user is a distributor

        users[_distributor].promotersFee = _promotersFee;

        SetDistributorFee(msg.sender, _distributor, _promotersFee);
    }

    /** @dev Set the markup on the face value of the ticket for the distributor, can only be done in the staging phase and by the distributor
      * @param _markup The address of the distributor.
      * @param _typeOfTicket The ticket type
      */
    function setMarkup(uint _markup, uint _typeOfTicket) onlyDistributor() stagingPhase() {
        users[msg.sender].markup[_typeOfTicket] = _markup;

        SetMarkup(msg.sender, _markup, _typeOfTicket);
    }
    /* @dev Set the user information corresponding to a particular address
]    * @param name Name we want to set the user struct with, we will expand this with more info as security and off-chain storage ramps up
    */

/**************************
End User Functions
**************************/
    function setUserDetails(string name, string info) {
        users[msg.sender].name = name;
        users[msg.sender].info = info;
        SetUserDetails(msg.sender, name, info);
    }

/**************************
Funding Phase - Ticketing
**************************/

    /**************************
        Modifiers
    **************************/
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
        Helper functions
    **************************/
    /** @dev Calculate the fraction of a value, while accounting for solidity's limitation for no fixed point values
      * @param _value Unit value to divide by
      * @param _percentage Percentage to take
      * @return  _total total value after division
      */
     function calc(uint _value, uint _percentage) returns (uint _total) {
        _total = (_value * _percentage) / 100;
     }

    /**************************
        Payable functions
    **************************/
    /** @dev Allow purchases from the promoter given that it's a valid user (distributor/end-consumer) and valid phase (public/private funding)
      * @param _typeOfTicket The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromPromoter(uint _typeOfTicket, uint _quantity) payable
    validUser() fundingPhase()  {
        User storage _user = users[msg.sender];

        //CONDITION CHECKS
        require(_quantity > 0);
        require(tickets[_typeOfTicket].created == true); //Require valid ticket type
        require(tickets[_typeOfTicket].remaining >= _quantity);

        //if theyre not a distributor, check if they will go over the comsumer limit
        if (!_user.isDistributor
            && _user.ticketsBought + _quantity > consumerMaxTickets) revert();

        //if the amount of tickets the Distributor seller goes over their allotted limits, reject it
        if(_user.isDistributor
            && (ticketsOf[msg.sender][_typeOfTicket] + _quantity
            > _user.allottedQuantity[_typeOfTicket])) revert();

        uint _total = tickets[_typeOfTicket].price * _quantity; //calculate total price
        uint _netValue = msg.value  - _total; //subtract ether sent from total price
        uint _membranFee  = calc(_total, membranFee); //calculate membran's fee

        require(_netValue >= 0); //make sure user paid enough

        //EFFECTS
        _user.ticketsBought += _quantity; //add to the total tickets bought for that user
        ticketsOf[msg.sender][_typeOfTicket] += _quantity; //add the tickets bought to the user for that ticket type
        tickets[_typeOfTicket].remaining -= _quantity; //subtract remaining quantity from pool of that ticket type

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;
        pendingWithdrawls[membran] += _membranFee;
        pendingWithdrawls[promoter] += _total - _membranFee;

        //alert of funds split
        FundsReceived(msg.sender, _netValue);
        FundsReceived(membran, _membranFee);
        FundsReceived(promoter, _total - _membranFee);


        BuyTicketFromPromoter(msg.sender, promoter, _user.isDistributor, _typeOfTicket, _quantity, msg.value);
    }

    /** @dev Allow purchases from the distributor given that it's a valid user (end-consumer only) and valid phase (public funding)
      * @param _typeOfTicket The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromDistributor(address _distributor, uint _typeOfTicket, uint _quantity) payable
    validDistributorAddress(_distributor) publicFundingPhase() {
        User storage _user = users[msg.sender];

        //CONDITION CHECKS
        //check that they are indeed an end comsumer
        require(msg.sender != membran
                && msg.sender != promoter
                && !_user.isDistributor);
        require(_quantity > 0);
        require(tickets[_typeOfTicket].created == true); //Require valid ticket type
        require(users[_distributor].allottedQuantity[_typeOfTicket] >= _quantity); //Require that the distributor has enough allotted quantities to sell to the user
        require ( _user.ticketsBought + _quantity <= consumerMaxTickets); //if theyre not a distributor, check if they will go over the comsumer limit

        uint _faceValue = tickets[_typeOfTicket].price * _quantity; //calculate the total face value based on the quantity
        uint _markup =  calc(_faceValue, users[_distributor].markup[_typeOfTicket]); //calculate the markup price over the face value
        uint _total = _faceValue + _markup; //calculate total price
        uint _netValue = msg.value - _total;  //subtract ether sent from total price
        uint _promotersFee = calc(_markup, users[_distributor].promotersFee); //calculate promoters fee on the markup of the distributor

        require(_netValue >= 0); //make sure user paid enough

        //EFFECTS
        ticketsOf[msg.sender][_typeOfTicket] += _quantity; //add the tickets bought for this particular ticket type
        _user.ticketsBought += _quantity; //add the tickets bought to the users total tickets bought
        users[_distributor].allottedQuantity[_typeOfTicket] -= _quantity; //subtract tickets bought from Distributor seller

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;
        pendingWithdrawls[promoter] +=  _promotersFee;
        pendingWithdrawls[_distributor]  += _total - _promotersFee;

        //alert of funds split
        FundsReceived(msg.sender, _netValue);
        FundsReceived(promoter, _promotersFee);
        FundsReceived(_distributor, _total - _promotersFee);

        BuyTicketFromDistributor(_distributor, msg.sender, users[msg.sender].isDistributor, _typeOfTicket, _quantity, msg.value);
    }
/**************************
Done Phase - Withdrawls
**************************/
    function withdraw() donePhase() {
        uint amount = pendingWithdrawls[msg.sender];
        pendingWithdrawls[msg.sender] = 0 ;
        msg.sender.transfer(amount);
        Withdraw(msg.sender, amount);
    }
}
