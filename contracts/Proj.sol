pragma solidity ^0.4.2;

contract Proj {

    /*
    * Staging -> The promoter is still setting up the project details
    * AwaitingApproval -> Contract is awaiting to be authenticated by a 3rd party as legitimate
    * PrivateFunding -> Contract is Distrib and ready to sell tixs to Distrib sellers, all tix transfers frozen
    * PublicFunding -> Contract is Distrib and ready to sell tixs to public, tix transfers for comsums frozen
    * Done -> Sale has finished and is finalized, tix transfers enabled for public 
    */
    enum State {Staging, AwaitingApproval, PrivateFunding, PublicFunding, Done}
    State public currentState; //hold state of contract to function as state machine

    string public projName; //name of the project to be created

    address public approver = 0x2222222222222222222222222222222222222222; //trusted 3rd party to approve this event, placeholder
    address public promo; //wallet of the promoter
    address public membran = 0x1111111111111111111111111111111111111111; //wallet of membran, placeholder

    uint public tixsLeft; //number of tickets left to be sold at this event 
    uint public totalTixs; //total number of tickets
    uint public comsumMaxTixs; //limit of the number of tixs a non-Distrib buyer can own 
    uint membranFee; //the fee that membran takes for this event
    
    mapping(address => Buyer) buyers; // address of the buyer => buyer struct
    mapping(uint => Tix) tixs; // type of tix => ticket struct
    mapping(address => mapping(uint => uint)) tixsOf; // address => type of ticket => quantity of tickets that address owns
    mapping(address => uint) pendingWithdrawls; //address => withdraw amount pending 

    //see https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes/17112 
    //for details on 32 byte IPFS hash
    struct Tix {
        uint price; //price of the ticket in wei
        uint remaining; //number of tickets left of this particular ticket
        bool created; //to check for empty values 
        bytes32 ipfsHash; //IPFS hash linking to off-chain ticket details
    } 
    struct Buyer {
        bool isDistrib;
        mapping(uint => uint) allotQuan; //number of tickets they are allowed to buy for that specific ticket type
        mapping(uint => uint) markup; //percent markup on the face value for that specific ticket type
        uint promosFee; //fee that the promoter takes from the markup
        bytes32 ipfsHash; //hash linking to buyers profile, if any
        uint tixBought; //total number of tickets bought for this buyer
    }

    function Proj(
        string _name,
        uint _membranFee,
        uint _totalTixs,
        uint _comsumMaxTixs) {
            projName = _name;
            membranFee = _membranFee;
            tixsLeft = _totalTixs;
            totalTixs= _totalTixs;
            comsumMaxTixs = _comsumMaxTixs;
            promo = msg.sender;  
            currentState = State.Staging;
            Created(promo, projName, membranFee, tixsLeft, totalTixs, comsumMaxTixs);
        }


/**************************
        Getters
**************************/
    /** 
      * @dev Checks if the tx sender is a distributor.
      * @return bool If tx sender is a distributor.
      */
    function isDistrib() constant returns(bool){
        return buyers[msg.sender].isDistrib;
    }

    /** @dev Getter for ticket values for a certain ticket type.
      * @param _tixType Ticket type.
      * @return  Ticket type.
      * @return  Ticket price in wei of that type.
      * @return  Number of tickets left of that type.
      */
    function getTixVals(uint _tixType) constant returns (uint, uint, uint){
        Tix _t = tixs[_tixType];
        return (_tixType, _t.price, _t.remaining);
    }

    /** @dev A query function to return data on a buyer based on a ticket type
      * @param _buyer Address of the buyer to query.
      * @param _tixType Ticket type.
      * @return  If the queried buyer is a distributor
      * @return  The allotted quantity of that ticket type for the buyer
      * @return  The markup that the distributor has placed on the face value of the ticket 
      * @return  The promoter fee to be taken out of the markup      
      */
    function queryBuyer(address _buyer, uint _tixType) constant returns (bool, uint, uint, uint){
        Buyer b = buyers[_buyer];
        return (b.isDistrib, b.allotQuan[_tixType], b.markup[_tixType], b.promosFee);
    }

/**************************
        Event Firers  
**************************/

     event Created(address indexed promo, string projName, uint membranFee, uint tixLeft, uint totalTixs, uint consumMaxTixs);
     event FinishStaging();
     event StartPrivateFunding();
     event StartPublicFunding();
     
     event AddTix(address indexed promo, uint typeOfTix);
     event AddIpfsDetailsToTix(address indexed promo, uint typeOfTix, bytes32 ipfsHash);
     event SetTixPrice (address indexed promo, uint typeOfTix, uint priceInWei);
     event SetTixQuantity (address indexed promo, uint typeOfTix, uint quantity);


     event AddDistrib (address indexed promo, address distrib);
     event SetDistribAllotQuan (address indexed promo, address _distrib, uint _typeOfTix, uint allotQuan);
     event SetDistribFee (address indexed promo, address _distrib, uint fee);

     event SetMarkup (address indexed distrib, uint _markup, uint _typeOfTix);

     event BuyTixFromPromo(address indexed from, address indexed to, bool indexed isDistrib, uint typeOfTix, uint quantity, uint weiSent);
     event BuyTixFromDistrib(address indexed from, address indexed to, bool indexed isDistrib, uint typeOfTix,  uint quantity, uint weiSent);

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
     function finishStaging() onlyPromo() {
         require(tixsLeft == 0);  //Require the promoter properly allocated all tixs into their respective types
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
     function startPublicFunding() onlyPromo() {
         require(currentState == State.PrivateFunding);
         currentState = State.PublicFunding;
         StartPublicFunding();
     }


/**************************
    Access Modifiers  
**************************/
    modifier onlyPromo() {
        require(msg.sender == promo);
        _;
    }
    modifier onlyApprover(){
        require(msg.sender == approver);
        _;
    }
    modifier onlyDistrib(){
        require(buyers[msg.sender].isDistrib);
        _;
    }

/**************************
    Staging Phase 
**************************/

    /**************************
        Tix Setters
    **************************/
    /** @dev Add a ticket to this Proj, can only be done in the staging phase and by the promoter
      * @param _typeOfTix Ticket type to create.
      * @param _priceInWei Price in wei to assign to this ticket type.      
      * @param _quantity Number of tickets of this type      
      */
    function addTix(uint _typeOfTix, uint _priceInWei, uint _quantity) onlyPromo() stagingPhase(){
        require(tixs[_typeOfTix].created == false); //Require that the specific ticket type hasnt been initialized yet
        tixs[_typeOfTix].created = true;
        
        AddTix(msg.sender, _typeOfTix);
        setTixPrice(_typeOfTix, _priceInWei); 
        setTixQuantity(_typeOfTix, _quantity); //Set ticket quantity for this type, drawing from the total ticket pool
    }
    /** @dev Add a ipfs hash to a ticket to store off-chain data, can only be done in the staging phase and by the promoter
      * @param _typeOfTix Ticket type to create.
      * @param _hash The ipfs hash to add
      */
    function addIpfsDetailsToTix(uint _typeOfTix, bytes32 _hash) onlyPromo() stagingPhase(){
        require(tixs[_typeOfTix].created == true); //Require that the ticket type has been made already
        tixs[_typeOfTix].ipfsHash = _hash; //Add the hash
        AddIpfsDetailsToTix(msg.sender, _typeOfTix, _hash);
    }
    /** @dev Set the ticket price, can only be done in the staging phase and by the promoter
      * @param _typeOfTix Ticket type to create.
      * @param _priceInWei The price of the ticket to set
      */
    function setTixPrice(uint _typeOfTix, uint _priceInWei) onlyPromo() stagingPhase() {
        require(tixs[_typeOfTix].created == true);
        require(_priceInWei >= 0);
        tixs[_typeOfTix].price = _priceInWei; //Set the price of the ticket of that type
        SetTixPrice(msg.sender, _typeOfTix, _priceInWei);
    }

    /** @dev Set the ticket quantity of that type, can only be done in the staging phase and by the promoter
      * @param _typeOfTix Ticket type to create.
      * @param _quantity The quantity of tickets to set
      */
    function setTixQuantity(uint _typeOfTix, uint _quantity) onlyPromo() stagingPhase() {
        require(tixsLeft >= _quantity); //require quantity wont be over the total ticket pool
        require(tixs[_typeOfTix].created == true);
        tixs[_typeOfTix].remaining = _quantity; 
        tixsLeft -= _quantity; //reduce the total ticket pool by quantity

        SetTixQuantity(msg.sender, _typeOfTix, _quantity);
    }

    /**************************
        Distrib Setters
    **************************/
    /** @dev Add a buyer as a distributor, can only be done by the promoter and in staging phase
      * @param _buyer Address of the buyer
      */
    function addDistrib(address _buyer) onlyPromo() stagingPhase() {
        buyers[_buyer].isDistrib = true;
        AddDistrib(msg.sender, _buyer);
    }

    /** @dev Set the alloted quantity of a ticket for a distributor, can only be done in the staging phase and by the promoter
      * @param _distrib The address of the distributor.
      * @param _typeOfTix The ticket type
      * @param _quantity Quantity of tickets      
      */
    function setDistribAllotQuan(address _distrib, uint _typeOfTix, uint _quantity) onlyPromo() stagingPhase() {
        require(tixs[_typeOfTix].remaining >= _quantity); //check for sufficient tixs of that type
        require(buyers[_distrib].isDistrib); //make sure this buyer is a distributor

        buyers[_distrib].allotQuan[_typeOfTix] = _quantity;

        SetDistribAllotQuan(msg.sender, _distrib, _typeOfTix, _quantity);
    }

    /** @dev Set the promoters fee for the distributors markup on the tickets, can only be done in the staging phase and by the promoter
      * @param _distrib The address of the distributor.
      * @param _promosFee The fee in percent to set for the distributor
      */
    function setDistribFee(address _distrib, uint _promosFee) onlyPromo() stagingPhase() {
        require(buyers[_distrib].isDistrib); //make sure this buyer is a distributor

        buyers[_distrib].promosFee = _promosFee;

        SetDistribFee(msg.sender, _distrib, _promosFee);
    }

    /** @dev Set the markup on the face value of the ticket for the distributor, can only be done in the staging phase and by the distributor
      * @param _markup The address of the distributor.
      * @param _typeOfTix The ticket type
      */
    function setMarkup(uint _markup, uint _typeOfTix) onlyDistrib() stagingPhase() {
        buyers[msg.sender].markup[_typeOfTix] = _markup;

        SetMarkup(msg.sender, _markup, _typeOfTix);
    }


/**************************
Funding Phase - Tixing
**************************/

    /**************************
        Modifiers
    **************************/
    /**@dev An address is a valid buyer if they're not membran/promoter/approver and we're in a phase where buying is valid*/
    modifier validBuyer() {
        //check what phase we're in and see if the buyer is valid for that phase 
        if (!buyers[msg.sender].isDistrib && currentState != State.PublicFunding) throw; //if they're not a distributor (so they are an end consumer) and we're not in a public phase, throw
        if (buyers[msg.sender].isDistrib && currentState != State.PrivateFunding) throw; //if they are a distributor and its not the private funding phase, throw
        //make sure theyre an end comsumer or a distributor
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promo);
        _;
    }

    /**@dev Check if the given address parameter is a valid distributor*/    
    modifier validDistribAddress(address _distrib) {
        require(buyers[_distrib].isDistrib);
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
      * @param _typeOfTix The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTixFromPromo(uint _typeOfTix, uint _quantity) payable 
    validBuyer() fundingPhase()  {
        Buyer storage _buyer = buyers[msg.sender]; 

        //CONDITION CHECKS
        require(_quantity > 0);
        require(tixs[_typeOfTix].created == true); //Require valid ticket type        
        require(tixs[_typeOfTix].remaining >= _quantity);
        
        //if theyre not a distributor, check if they will go over the comsumer limit
        if (!_buyer.isDistrib 
            && _buyer.tixBought + _quantity > comsumMaxTixs) throw;

        //if the amount of tixs the Distrib seller goes over their allotted limits, reject it
        if(_buyer.isDistrib
            && (tixsOf[msg.sender][_typeOfTix] + _quantity  
            > _buyer.allotQuan[_typeOfTix])) throw;

        uint _total = tixs[_typeOfTix].price * _quantity; //calculate total price
        uint _netValue = msg.value  - _total; //subtract ether sent from total price
        uint _membranFee  = calc(_total, membranFee); //calculate membran's fee 

        require(_netValue >= 0); //make sure buyer paid enough
    
        //EFFECTS
        _buyer.tixBought += _quantity; //add to the total tickets bought for that buyer        
        tixsOf[msg.sender][_typeOfTix] += _quantity; //add the tixs bought to the buyer for that ticket type
        tixs[_typeOfTix].remaining -= _quantity; //subtract remaining quantity from pool of that tix type

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue; 
        pendingWithdrawls[membran] += _membranFee;
        pendingWithdrawls[promo] += _total - _membranFee;

        BuyTixFromPromo(promo, msg.sender, _buyer.isDistrib, _typeOfTix, _quantity, msg.value);
    }

    /** @dev Allow purchases from the distributor given that it's a valid buyer (end-consumer only) and valid phase (public funding)
      * @param _typeOfTix The ticket type to purchase
      * @param _quantity How many of that type to purchase
      */
    function buyTixFromDistrib(address _distrib, uint _typeOfTix, uint _quantity) payable 
    validDistribAddress(_distrib) publicFundingPhase() {
        Buyer storage _buyer = buyers[msg.sender]; 

        //CONDITION CHECKS
        //check that they are indeed an end comsumer
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promo 
                && !_buyer.isDistrib);
        require(_quantity > 0);
        require(tixs[_typeOfTix].created == true); //Require valid tix type
        require(buyers[_distrib].allotQuan[_typeOfTix] >= _quantity); //Require that the distributor has enough allotted quantities to sell to the buyer
        require ( _buyer.tixBought + _quantity <= comsumMaxTixs); //if theyre not a distributor, check if they will go over the comsumer limit
        
        uint _faceValue = tixs[_typeOfTix].price * _quantity; //calculate the total face value based on the quantity
        uint _markup =  calc(_faceValue, buyers[_distrib].markup[_typeOfTix]); //calculate the markup price over the face value
        uint _total = _faceValue + _markup; //calculate total price
        uint _netValue = msg.value - _total;  //subtract ether sent from total price
        uint _promosFee = calc(_markup, buyers[_distrib].promosFee); //calculate promoters fee on the markup of the distributor

        require(_netValue >= 0); //make sure buyer paid enough

        //EFFECTS
        tixsOf[msg.sender][_typeOfTix] += _quantity; //add the tickets bought for this particular ticket type
        _buyer.tixBought += _quantity; //add the tickets bought to the buyers total tickets bought
        buyers[_distrib].allotQuan[_typeOfTix] -= _quantity; //subtract tixs bought from Distrib seller

        //split payment between parties
        pendingWithdrawls[msg.sender] += _netValue;
        pendingWithdrawls[promo] +=  _promosFee;
        pendingWithdrawls[_distrib]  += _total - _promosFee; 

        BuyTixFromDistrib(_distrib, msg.sender, buyers[msg.sender].isDistrib, _typeOfTix, _quantity, msg.value);
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