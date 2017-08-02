pragma solidity ^0.4.2;

contract Project {

    /*
    * Staging -> The promoter is still setting up the project details
    * AwaitingApproval -> Contract is awaiting to be authenticated by a 3rd party as legitimate
    * PrivateFunding -> Contract is Distributor and ready to sell tickets to Distributor sellers, all ticket transfers frozen
    * PublicFunding -> Contract is Distributor and ready to sell tickets to public, ticket transfers for comsums frozen
    * Done -> Sale has finished and is finalized, ticket transfers enabled for public 
    */
    enum State {Staging, AwaitingApproval, PrivateFunding, PublicFunding, Done}
    State public currentState; //hold state of contract to function as state machine

    string public projectName; //name of the project to be created

    address public approver = 0x2222222222222222222222222222222222222222; //trusted 3rd party to approve this event, placeholder
    address public promoter; //wallet of the promoter
    address public membran = 0x1111111111111111111111111111111111111111; //wallet of membran, placeholder

    uint public ticketsLeft; //number of tickets left to be sold at this event 
    uint public totalTickets; //total number of tickets
    uint public consumerMaxTickets; //limit of the number of tickets a non-Distributor buyer can own 
    uint membranFee; //the fee that membran takes for this event
    
    mapping(address => Buyer) buyers; // address of the buyer => buyer struct
    mapping(uint => Ticket) tickets; // type of ticket => ticket struct
    mapping(address => mapping(uint => uint)) ticketsOf; // address => type of ticket => quantity of tickets that address owns
    mapping(address => uint) pendingWithdrawls; //address => withdraw amount pending 

    //see https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes/17112 
    //for details on 32 byte IPFS hash
    struct Ticket {
        uint price; //price of the ticket in wei
        uint remaining; //number of tickets left of this particular ticket
        bool created; //to check for empty values 
        bytes32 ipfsHash; //IPFS hash linking to off-chain ticket details
    } 
    struct Buyer {
        bool isDistributor;
        mapping(uint => uint) allottedQuantity; //number of tickets they are allowed to buy for that specific ticket type
        mapping(uint => uint) markup; //percent markup on the face value for that specific ticket type
        uint promotersFee; //fee that the promoter takes from the markup
        bytes32 ipfsHash; //hash linking to buyers profile, if any
        uint ticketsBought; //total number of tickets bought for this buyer
    }

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
    function isDistributor() constant returns(bool){
        return buyers[msg.sender].isDistributor;
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

    /** @dev A query function to return data on a buyer based on a ticket type
      * @param _buyer Address of the buyer to query.
      * @param _ticketType Ticket type.
      * @return  If the queried buyer is a distributor
      * @return  The allotted quantity of that ticket type for the buyer
      * @return  The markup that the distributor has placed on the face value of the ticket 
      * @return  The promoter fee to be taken out of the markup      
      */
    function queryBuyer(address _buyer, uint _ticketType) constant returns (bool, uint, uint, uint){
        Buyer b = buyers[_buyer];
        return (b.isDistributor, b.allottedQuantity[_ticketType], b.markup[_ticketType], b.promotersFee);
    }

/**************************
        Event Firers  
**************************/

     event Created(address indexed promoter, string projectName, uint membranFee, uint ticketLeft, uint totalTickets, uint consumerMaxTickets);
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

     event BuyTicketFromPromoter(address indexed from, address indexed to, bool indexed isDistributor, uint typeOfTicket, uint quantity, uint weiSent);
     event BuyTicketFromDistributor(address indexed from, address indexed to, bool indexed isDistributor, uint typeOfTicket,  uint quantity, uint weiSent);

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
    modifier approvalPhase(){
        require(currentState == State.AwaitingApproval);
        _;
    }
    modifier donePhase(){
        require(currentState == State.Done);
        _;
    }

/**************************
    Phase Setters
**************************/
    /** @dev Move state forward from staging to awaiting approval, can only be done by the promoter */
     function finishStaging() onlyPromoter() {
         require(ticketsLeft == 0);  //Require the promoter properly allocated all tickets into their respective types
         require(currentState == State.Staging); //Require the previous state to be Staging to move on
         currentState = State.AwaitingApproval; 
         FinishStaging();
     }
    /** @dev Move state forward from awaiting approval to private funding, can only be done by the approver */     
     function startPrivateFunding() onlyApprover() {
        require(currentState == State.AwaitingApproval); //Require the previous state to be awaiting approval
        currentState = State.PrivateFunding;
        StartPrivateFunding();
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
    modifier onlyApprover(){
        require(msg.sender == approver);
        _;
    }
    modifier onlyDistributor(){
        require(buyers[msg.sender].isDistributor);
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
    /** @dev Add a buyer as a distributor, can only be done by the promoter and in staging phase
      * @param _buyer Address of the buyer
      */
    function addDistributor(address _buyer) onlyPromoter() stagingPhase() {
        if(buyers[_buyer].isDistributor == true) return; //dont want to throw, just return early instead
        buyers[_buyer].isDistributor = true;
        AddDistributor(msg.sender, _buyer);
    }

    /** @dev Set the alloted quantity of a ticket for a distributor, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _typeOfTicket The ticket type
      * @param _quantity Quantity of tickets      
      */
    function setDistributorAllottedQuantity(address _distributor, uint _typeOfTicket, uint _quantity) onlyPromoter() stagingPhase() {
        require(tickets[_typeOfTicket].remaining >= _quantity); //check for sufficient tickets of that type
        require(buyers[_distributor].isDistributor); //make sure this buyer is a distributor

        buyers[_distributor].allottedQuantity[_typeOfTicket] = _quantity;

        SetDistributorAllottedQuantity(msg.sender, _distributor, _typeOfTicket, _quantity);
    }

    /** @dev Set the promoters fee for the distributors markup on the tickets, can only be done in the staging phase and by the promoter
      * @param _distributor The address of the distributor.
      * @param _promotersFee The fee in percent to set for the distributor
      */
    function setDistributorFee(address _distributor, uint _promotersFee) onlyPromoter() stagingPhase() {
        require(buyers[_distributor].isDistributor); //make sure this buyer is a distributor

        buyers[_distributor].promotersFee = _promotersFee;

        SetDistributorFee(msg.sender, _distributor, _promotersFee);
    }

    /** @dev Set the markup on the face value of the ticket for the distributor, can only be done in the staging phase and by the distributor
      * @param _markup The address of the distributor.
      * @param _typeOfTicket The ticket type
      */
    function setMarkup(uint _markup, uint _typeOfTicket) onlyDistributor() stagingPhase() {
        buyers[msg.sender].markup[_typeOfTicket] = _markup;

        SetMarkup(msg.sender, _markup, _typeOfTicket);
    }


/**************************
Funding Phase - Ticketing
**************************/

    /**************************
        Modifiers
    **************************/
    /**@dev An address is a valid buyer if they're not membran/promoter/approver and we're in a phase where buying is valid*/
    modifier validBuyer() {
        //check what phase we're in and see if the buyer is valid for that phase 
        if (!buyers[msg.sender].isDistributor && currentState != State.PublicFunding) throw; //if they're not a distributor (so they are an end consumer) and we're not in a public phase, throw
        if (buyers[msg.sender].isDistributor && currentState != State.PrivateFunding) throw; //if they are a distributor and its not the private funding phase, throw
        //make sure theyre an end comsumer or a distributor
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promoter);
        _;
    }

    /**@dev Check if the given address parameter is a valid distributor*/    
    modifier validDistributorAddress(address _distributor) {
        require(buyers[_distributor].isDistributor);
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
    /** @dev Allow purchases from the promoter given that it's a valid buyer (distributor/end-consumer) and valid phase (public/private funding)
      * @param _typeOfTicket The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromPromoter(uint _typeOfTicket, uint _quantity) payable 
    validBuyer() fundingPhase()  {
        Buyer storage _buyer = buyers[msg.sender]; 

        //CONDITION CHECKS
        require(_quantity > 0);
        require(tickets[_typeOfTicket].created == true); //Require valid ticket type        
        require(tickets[_typeOfTicket].remaining >= _quantity);
        
        //if theyre not a distributor, check if they will go over the comsumer limit
        if (!_buyer.isDistributor 
            && _buyer.ticketsBought + _quantity > consumerMaxTickets) throw;

        //if the amount of tickets the Distributor seller goes over their allotted limits, reject it
        if(_buyer.isDistributor
            && (ticketsOf[msg.sender][_typeOfTicket] + _quantity  
            > _buyer.allottedQuantity[_typeOfTicket])) throw;

        uint _total = tickets[_typeOfTicket].price * _quantity; //calculate total price
        uint _netValue = msg.value  - _total; //subtract ether sent from total price
        uint _membranFee  = calc(_total, membranFee); //calculate membran's fee 

        require(_netValue >= 0); //make sure buyer paid enough
    
        //EFFECTS
        _buyer.ticketsBought += _quantity; //add to the total tickets bought for that buyer        
        ticketsOf[msg.sender][_typeOfTicket] += _quantity; //add the tickets bought to the buyer for that ticket type
        tickets[_typeOfTicket].remaining -= _quantity; //subtract remaining quantity from pool of that ticket type

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue; 
        pendingWithdrawls[membran] += _membranFee;
        pendingWithdrawls[promoter] += _total - _membranFee;

        BuyTicketFromPromoter(promoter, msg.sender, _buyer.isDistributor, _typeOfTicket, _quantity, msg.value);
    }

    /** @dev Allow purchases from the distributor given that it's a valid buyer (end-consumer only) and valid phase (public funding)
      * @param _typeOfTicket The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTicketFromDistributor(address _distributor, uint _typeOfTicket, uint _quantity) payable 
    validDistributorAddress(_distributor) publicFundingPhase() {
        Buyer storage _buyer = buyers[msg.sender]; 

        //CONDITION CHECKS
        //check that they are indeed an end comsumer
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promoter 
                && !_buyer.isDistributor);
        require(_quantity > 0);
        require(tickets[_typeOfTicket].created == true); //Require valid ticket type
        require(buyers[_distributor].allottedQuantity[_typeOfTicket] >= _quantity); //Require that the distributor has enough allotted quantities to sell to the buyer
        require ( _buyer.ticketsBought + _quantity <= consumerMaxTickets); //if theyre not a distributor, check if they will go over the comsumer limit
        
        uint _faceValue = tickets[_typeOfTicket].price * _quantity; //calculate the total face value based on the quantity
        uint _markup =  calc(_faceValue, buyers[_distributor].markup[_typeOfTicket]); //calculate the markup price over the face value
        uint _total = _faceValue + _markup; //calculate total price
        uint _netValue = msg.value - _total;  //subtract ether sent from total price
        uint _promotersFee = calc(_markup, buyers[_distributor].promotersFee); //calculate promoters fee on the markup of the distributor

        require(_netValue >= 0); //make sure buyer paid enough

        //EFFECTS
        ticketsOf[msg.sender][_typeOfTicket] += _quantity; //add the tickets bought for this particular ticket type
        _buyer.ticketsBought += _quantity; //add the tickets bought to the buyers total tickets bought
        buyers[_distributor].allottedQuantity[_typeOfTicket] -= _quantity; //subtract tickets bought from Distributor seller

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;
        pendingWithdrawls[promoter] +=  _promotersFee;
        pendingWithdrawls[_distributor]  += _total - _promotersFee; 

        BuyTicketFromDistributor(_distributor, msg.sender, buyers[msg.sender].isDistributor, _typeOfTicket, _quantity, msg.value);
    }
/**************************
Done Phase - Withdrawls
**************************/
    function withdraw() donePhase(){
        uint amount = pendingWithdrawls[msg.sender];
        pendingWithdrawls[msg.sender] = 0 ;
        msg.sender.transfer(amount);
        Withdraw(msg.sender, amount);
    }
}