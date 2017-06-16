pragma solidity ^0.4.2;

//16 is the upper limit for Solidity
//Because it treats locals as stack elements
contract Proj {

    /*
    * Staging -> The promo is still setting up the event details
    * AwaitingApproval -> Contract is awaiting to be authenticated by a 3rd party as legitimate
    * PrivateFunding -> Contract is Distrib and ready to sell tixs to Distrib sellers, all tix transfers frozen
    * PublicFunding -> Contract is Distrib and ready to sell tixs to public, tix transfers for comsums frozen
    * Done -> Sale has finished and is finalized, tix transfers enabled for public 
    */
    enum State {Staging, AwaitingApproval, PrivateFunding, PublicFunding, Done}
    State public currentState;

    string public projName; //name of the event to be created

    address public approver = 0x2222222222222222222222222222222222222222; //trusted 3rd party to approve this event
    address public promo; //wallet of the promo
    address public membran = 0x1111111111111111111111111111111111111111; //wallet of membran, hardcoded

    uint public tixsLeft; //number of tixs to be sold at this event 
    uint public totalTixs;
    uint public comsumMaxTixs; //limit of the number of tixs a non-Distrib buyer can own 
    uint membranFee; //the fee that membran takes for this event
    uint tixTypes = 0; //the number of tix types we have
    
    uint[] tixsArr;
    address[] buyerArr;
    mapping(address => Buyer) buyers; // address of the buyer => {isDistrib, quantity allowed to buy}
    mapping(uint => Tix) tixs; // type of tix => {price, quantity}
    mapping(address => mapping(uint => uint)) tixsOf;
    mapping(address => uint) pendingWithdrawls;

    //see https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes/17112 
    //for details on 32 byte IPFS hash
    struct Tix {
        uint price;
        uint remaining;
        //to check for empty values 
        bool created;
        bytes32 ipfsHash;
    } 
    struct Buyer {
        bool isDistrib;
        mapping(uint => uint) allotQuan;
        mapping(uint => uint) markup;
        uint promosFee;
        //to check for empty values 
        bool created;
        bytes32 ipfsHash;
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
            Created(promo, projName);
        }


/**************************
        Getters
**************************/
    function isDistrib() constant returns(bool){
        return buyers[msg.sender].isDistrib;
    }
    function getTixVals(uint _tixType) constant returns (uint, uint, uint){
        Tix _t = tixs[_tixType];
        return (_tixType, _t.price, _t.remaining);
    }
    function queryBuyer(address _buyer, uint _tixType) constant returns (bool isApp, uint alotQuant, uint mrkUp, uint promoFee){
        Buyer b = buyers[_buyer];
        return (b.isDistrib, b.allotQuan[_tixType], b.markup[_tixType], b.promosFee);
    }

/**************************
        Event Firers  
**************************/
     event Created(address indexed promo, string projName);

     event FinishStaging();
     event StartPrivateFunding();
     event StartPublicFunding();
     
     event AddTix(address indexed from, uint typeOfTix);
     event AddIpfsDetailsToTix(address indexed from, uint typeOfTix, bytes32 _hash);
     event SetTixPrice (address indexed from, uint typeOfTix, uint priceInWei);
     event SetTixQuantity (address indexed from, uint typeOfTix, uint quantity);


     event SetDistrib (address indexed from, address buyer);
     event SetDistribAllotQuan (address indexed from, address _distrib, uint _typeOfTix, uint _quantity);
     event SetDistribFee (address indexed from, address _distrib, uint _promosFee);

     event SetMarkup (address indexed from, uint _markup, uint _typeOfTix);

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
     function finishStaging() onlyPromo() {
         //make sure the promo properly allocated all tixs into their respective types
         require(tixsLeft == 0);
         require(currentState == State.Staging);
         currentState = State.AwaitingApproval;
         FinishStaging();
     }
     function startPrivateFunding() onlyApprover() {
        require(currentState == State.AwaitingApproval);
        currentState = State.PrivateFunding;
        StartPrivateFunding();
     }
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
    function addTix(uint _typeOfTix, uint _priceInWei, uint _quantity) onlyPromo() stagingPhase(){
        //make sure we havent added the same tix twice
        require(tixs[_typeOfTix].created == false);
        tixs[_typeOfTix].created = true;
        tixsArr.push(_typeOfTix);
        
        AddTix(msg.sender, _typeOfTix);
        setTixPrice(_typeOfTix, _priceInWei);
        setTixQuantity(_typeOfTix, _quantity);
    }
    function addIpfsDetailsToTix(uint _typeOfTix, bytes32 _hash) onlyPromo() stagingPhase(){
        require(tixs[_typeOfTix].created == true);
        tixs[_typeOfTix].ipfsHash = _hash;
        AddIpfsDetailsToTix(msg.sender, _typeOfTix, _hash);
    }
    function setTixPrice(uint _typeOfTix, uint _priceInWei) onlyPromo() stagingPhase() {
        require(tixs[_typeOfTix].created == true);
        require(_priceInWei >= 0);
        tixs[_typeOfTix].price = _priceInWei;

        SetTixPrice(msg.sender, _typeOfTix, _priceInWei);
    }

    function setTixQuantity(uint _typeOfTix, uint _quantity) onlyPromo() stagingPhase() {
        //make sure we dont go over allotted tixs for entire event
        require(tixsLeft >= _quantity);
        require(tixs[_typeOfTix].created == true);
        if(tixs[_typeOfTix].remaining == 0) {
            tixTypes += 1;
        }
        tixs[_typeOfTix].remaining = _quantity;
        tixsLeft -= _quantity;

        SetTixQuantity(msg.sender, _typeOfTix, _quantity);
    }

    /**************************
        Distrib Setters
    **************************/
    function setDistrib(address _buyer) onlyPromo() stagingPhase() {
        buyers[_buyer].isDistrib = true;
        SetDistrib(msg.sender, _buyer);
    }

    function setDistribAllotQuan(address _distrib, uint _typeOfTix, uint _quantity) onlyPromo() stagingPhase() {
        //check for sufficient tixs of that type
        require(tixs[_typeOfTix].remaining >= _quantity);

        //make sure this buyer is Distrib first
        require(buyers[_distrib].isDistrib);

        buyers[_distrib].allotQuan[_typeOfTix] = _quantity;

        SetDistribAllotQuan(msg.sender, _distrib, _typeOfTix, _quantity);
    }

    //set the promos fee to take from the Distrib buyer
    function setDistribFee(address _distrib, uint _promosFee) onlyPromo() stagingPhase() {
        //make sure this buyer is Distrib first
        require(buyers[_distrib].isDistrib);

        buyers[_distrib].promosFee = _promosFee;

        SetDistribFee(msg.sender, _distrib, _promosFee);
    }

    function setMarkup(uint _markup, uint _typeOfTix) onlyDistrib() {
        buyers[msg.sender].markup[_typeOfTix] = _markup;

        SetMarkup(msg.sender, _markup, _typeOfTix);
    }


/**************************
Funding Phase - Tixing
**************************/

    /**************************
        Modifiers
    **************************/
    modifier validBuyer() {
        //we want to check what phase we're in and see if the buyer is valid for that phase 
        if (!buyers[msg.sender].isDistrib && currentState != State.PublicFunding) throw;
        if (buyers[msg.sender].isDistrib && currentState != State.PrivateFunding) throw;
        //make sure theyre an end comsumer or an Distrib buyer
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promo);
        _;
    }

    modifier validDistrib(address _distrib) {
        require(currentState == State.PublicFunding);
        require(buyers[_distrib].isDistrib);
        _;
    }

    /**************************
        Helper functions
    **************************/
     function calc(uint value, uint percentage) returns (uint total) {
        total = (value * percentage) / 100;
     }

    /**************************
        Payable functions
    **************************/
    function buyTixFromPromo(uint _typeOfTix, uint _quantity) payable 
    validBuyer() fundingPhase()  {

        //CONDITION CHECKS
        require(_quantity > 0);
        require(_typeOfTix >= 0 && _typeOfTix <= tixTypes );
        require(tixs[_typeOfTix].remaining >= _quantity);
        
        //add up the total number of tixs the address has
        uint _tixsOfSender = 0;
        for (uint tixType = 0; tixType <= tixTypes; tixType++) {
            _tixsOfSender += tixsOf[msg.sender][tixType];
        }
        
        //if theyre not an Distrib seller, check if they will go over the comsum limit
        if (!buyers[msg.sender].isDistrib 
            && _tixsOfSender + _quantity > comsumMaxTixs) throw;

        //if the amount of tixs the Distrib seller goes over their allotted limits, reject it
        if(buyers[msg.sender].isDistrib
            && (tixsOf[msg.sender][_typeOfTix] + _quantity  
            > buyers[msg.sender].allotQuan[_typeOfTix])) throw;

        uint _total = tixs[_typeOfTix].price * _quantity;
        uint _netValue = msg.value  - _total;
        uint _membranFee  = calc(_total, membranFee);

        //make sure buyer paid enough
        require(_netValue >= 0);
    
        //EFFECTS
        //add the tixs bought to the buyer
        tixsOf[msg.sender][_typeOfTix] += _quantity;

        //subtract remaining quantity from pool of that tix type
        tixs[_typeOfTix].remaining -= _quantity;

        //split payment
        pendingWithdrawls[msg.sender] += _netValue; 
        pendingWithdrawls[membran] += _membranFee;
        pendingWithdrawls[promo] += _total - _membranFee;

        BuyTixFromPromo(promo, msg.sender, buyers[msg.sender].isDistrib, _typeOfTix, _quantity, msg.value);
    }

    function buyTixFromDistrib(address _distrib, uint _typeOfTix, uint _quantity) payable 
    validDistrib(_distrib) publicFundingPhase() {

        //CONDITION CHECKS
        //check that they are indeed an end comsum
        require(msg.sender != membran
                && msg.sender != approver 
                && msg.sender != promo 
                && !buyers[msg.sender].isDistrib);
            
        require(_quantity > 0);

        //make sure its a valid tix type, may need to check off-chain too
        require(_typeOfTix >= 0 && _typeOfTix <= tixTypes );

        //make sure the Distrib has enough allotted quantities to sell to the buyer
        require(buyers[_distrib].allotQuan[_typeOfTix] >= _quantity);

       

        //add up the total number of tixs the address has
        uint _tixsOfSender = 0;
        for (uint tixType = 0; tixType <= tixTypes; tixType++) {
            _tixsOfSender += tixsOf[msg.sender][tixType];
        }
        
        //if theyre not an Distrib, check if they will go over the comsum limit
        require ( _tixsOfSender + _quantity <= comsumMaxTixs);
        
        uint _faceValue = tixs[_typeOfTix].price * _quantity;
        uint _markup =  calc(_faceValue, buyers[_distrib].markup[_typeOfTix]);
        uint _total = _faceValue + _markup;
        uint _netValue = msg.value - _total;
        uint _promosFee = calc(_markup, buyers[_distrib].promosFee);

        //make sure buyer paid enough
        require(_netValue >= 0);

        //EFFECTS

        //add the tixs bought to the buyer
        tixsOf[msg.sender][_typeOfTix] += _quantity;

        //subtract tixs bought from Distrib seller
        buyers[_distrib].allotQuan[_typeOfTix] -= _quantity;

        //split payment
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