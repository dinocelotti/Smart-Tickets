pragma solidity ^0.4.2;

contract Event {

    //name of the event to be created
    string public eventName;

    //address of a trusted 3rd party to approve this event as authentic
    address approver = 0x2222222222222222222222222222222222222222;

    //wallet of the promoter
    address promoter;

    //wallet of membran, hardcoded
    address membran = 0x1111111111111111111111111111111111111111;

    //the fee that membran takes for this event
    uint membranFeePercent;


    mapping(address => uint) pendingReturns;

    /*
    * Staging -> The promoter is still setting up the event details
    * AwaitingApproval -> Contract is awaiting to be authenticated by a 3rd party as legitimate
    * PrivateFunding -> Contract is approved and ready to sell tickets to approved sellers, all ticket transfers frozen
    * PublicFunding -> Contract is approved and ready to sell tickets to public, ticket transfers for consumers frozen
    * Done -> Sale has finished and is finalized, ticket transfers enabled for public 
    */
    enum State {Staging, AwaitingApproval, PrivateFunding, PublicFunding, Done}
    State currentState;
    
    //the number of ticket types we have, with 0 being a general ticket
    uint8 ticketTypes = 0;

    // address => ticket type (uint8) => number of tickets
    // we can use an off-chain solution to map a uint8 to a location/ticket type
    mapping(address => mapping(uint8 => uint)) ticketsOf;

    //number of tickets to be sold at this event 
    //this should be set to 0 before staging phase ends as they will be assigned non-generic types in tickets
    uint ticketsLeft;
    
    struct Ticket {
        uint price;
        uint remainingQuantity;
    }

    // type of ticket => {price, quantity}
    mapping(uint8 => Ticket) tickets;

    //limit of the number of tickets a non-approved buyer can own 
    uint consumerMaxTickets;
    
    struct Buyer {
        bool isApproved;
        mapping(uint8 => uint) allottedQuantities;
        mapping(uint8 => uint) markupPercent;
        uint promotersFeePercent;
    }

    // address of the buyer => {isApproved, quantity allowed to buy}
    mapping(address => Buyer) buyers;

    function Event(
        string _name,
        uint _membranFee,
        uint _totalTickets,
        uint _consumerMaxTickets) {
            eventName = _name;
            membranFeePercent = _membranFee;
            ticketsLeft = _totalTickets;
            consumerMaxTickets = _consumerMaxTickets;
            promoter = msg.sender;  
            currentState = State.Staging;
        }

    /**************************
     Event Firers  
     **************************/
     event Purchased(address indexed to, bool indexed approvedBuyer, uint8 typeOfTicket, uint pricePerTicket, uint quantity, uint weiSent);

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
     function finishStaging() onlyPromoter() {
         //make sure the promoter properly allocated all tickets into their respective types
         require(ticketsLeft == 0);
         require(currentState == State.Staging);
         currentState = State.AwaitingApproval;
     }
     function startPrivateFunding() onlyApprover() {
        require(currentState == State.AwaitingApproval);
        currentState = State.PrivateFunding;
     }
     function startPublicFunding() onlyPromoter() {
         require(currentState == State.PrivateFunding);
         currentState = State.PublicFunding;
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
    modifier onlyApprovedBuyer(){
        require(buyers[msg.sender].isApproved);
        _;
    }

    /**************************
     Staging Phase 
     **************************/

    function setTicketPriceAndQuantity(uint8 _typeOfTicket, uint _priceInWei) onlyPromoter() stagingPhase() {
        require(_priceInWei >= 0);
        tickets[_typeOfTicket].price = _priceInWei;
    }
    function setTicketQuantity(uint8 _typeOfTicket, uint _quantity) onlyPromoter() stagingPhase() {
        //make sure we dont go over allotted tickets for entire event
        require(ticketsLeft >= _quantity);

        if(tickets[_typeOfTicket].remainingQuantity == 0) {
            ticketTypes += 1;
        }
        tickets[_typeOfTicket].remainingQuantity = _quantity;
        ticketsLeft -= _quantity;
    }
    function approveBuyer(address _buyer) onlyPromoter() stagingPhase() {
        buyers[_buyer].isApproved = true;
    }
    function setBuyerAllottedQuantities(address _buyer, uint8 _typeOfTicket, uint _quantity) onlyPromoter() stagingPhase() {
        //check for sufficient tickets of that type
        require(tickets[_typeOfTicket].remainingQuantity >= _quantity);

        //make sure this buyer is approved first
        require(buyers[_buyer].isApproved);

        buyers[_buyer].allottedQuantities[_typeOfTicket] = _quantity;
    }
    //set the promoters fee to take from the approved buyer
    function setApprovedBuyerFee(address _buyer, uint _promotersFee) onlyPromoter() stagingPhase() {
        //make sure this buyer is approved first
        require(buyers[_buyer].isApproved);

        buyers[_buyer].promotersFeePercent = _promotersFee;
    }
    function setMarkup(uint _markupPercent, uint8 _typeOfTicket) onlyApprovedBuyer() {
        buyers[msg.sender].markupPercent[_typeOfTicket] = _markupPercent;
    }


    /**************************
     Funding Phase 
     **************************/
    modifier validBuyer() {
        //we want to check what phase we're in and see if the buyer is valid for that phase 
        if (!buyers[msg.sender].isApproved && currentState != State.PublicFunding) throw;
        if (buyers[msg.sender].isApproved && currentState != State.PrivateFunding) throw;
        //make sure theyre an end comsumer or an approved buyer
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promoter);
        _;
    }


    function purchaseTicketFromPromoter(uint8 _typeOfTicket, uint _quantity) payable 
    validBuyer() fundingPhase()  {

        //CONDITION CHECKS
        require(_quantity > 0);
        require(_typeOfTicket >= 0 && _typeOfTicket <= ticketTypes );
        require(tickets[_typeOfTicket].remainingQuantity >= _quantity);
        uint _ticketsOfSender = 0;

        //add up the total number of tickets the address has
        for (uint8 ticketType = 0; ticketType <= ticketTypes; ticketType++) {
            _ticketsOfSender += ticketsOf[msg.sender][ticketType];
        }
        
        //if theyre not an approved seller, check if they will go over the consumer limit
        if (!buyers[msg.sender].isApproved 
            && _ticketsOfSender + _quantity > consumerMaxTickets) throw;

        //if the amount of tickets the approved seller goes over their allotted limits, reject it
        if(buyers[msg.sender].isApproved
            && (ticketsOf[msg.sender][_typeOfTicket] + _quantity  
            > buyers[msg.sender].allottedQuantities[_typeOfTicket])) throw;


        //EFFECTS
        uint _total = tickets[_typeOfTicket].price * _quantity;
        uint _netValue = msg.value  - _total;
        require(_netValue >= 0);
    
        ticketsOf[msg.sender][_typeOfTicket] += _quantity;
        tickets[_typeOfTicket].remainingQuantity -= _quantity;

        //allow buyer to withdraw their extra funds if they sent too much
        pendingReturns[msg.sender] += _netValue; 
        uint _membranFee  = calcPercent(_total, membranFeePercent);
        pendingReturns[membran] += _membranFee;
        pendingReturns[promoter] += _total - _membranFee;

        Purchased(msg.sender, buyers[msg.sender].isApproved, _typeOfTicket, tickets[_typeOfTicket].price, _quantity, msg.value);
    }

    modifier validApprovedSeller(address _approvedSeller) {
        require(currentState == State.PublicFunding);
        require(buyers[_approvedSeller].isApproved);
        _;
    }

    function purchaseTicketFromApprovedSeller(address _approvedSeller, uint8 _typeOfTicket, uint _quantity) payable 
    validApprovedSeller(_approvedSeller) publicFundingPhase() {

        //CONDITION CHECKS
        //check that they are indeed a end consumer
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promoter 
                && !buyers[msg.sender].isApproved);
        require(_quantity > 0);
        require(_typeOfTicket >= 0 && _typeOfTicket <= ticketTypes );
        require(buyers[_approvedSeller].allottedQuantities[_typeOfTicket] >= _quantity);

        uint _ticketsOfSender = 0;

        //add up the total number of tickets the address has
        for (uint8 ticketType = 0; ticketType <= ticketTypes; ticketType++) {
            _ticketsOfSender += ticketsOf[msg.sender][ticketType];
        }
        
        //if theyre not an approved seller, check if they will go over the consumer limit
        require ( _ticketsOfSender + _quantity <= consumerMaxTickets);
        


        //EFFECTS
        uint _faceValue = tickets[_typeOfTicket].price * _quantity;
        uint _markup =  calcPercent(_faceValue, buyers[_approvedSeller].markupPercent[_typeOfTicket]);
        uint _total = _faceValue + _markup;
        uint _netValue = msg.value - _total;
        require(_netValue >= 0);

        uint _promotersFee = calcPercent(_markup, buyers[_approvedSeller].promotersFeePercent);
        buyers[_approvedSeller].allottedQuantities[_typeOfTicket] -= _quantity;
        pendingReturns[msg.sender] += _netValue;
        pendingReturns[promoter] +=  _promotersFee;
        pendingReturns[_approvedSeller]  += _total - _promotersFee; 
    }

    /**************************
     Helper functions
     **************************/
     function calcPercent(uint value, uint percentage) returns (uint total) {
        total = (value * percentage) / 100;
     }

}