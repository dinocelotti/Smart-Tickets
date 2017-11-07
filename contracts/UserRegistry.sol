pragma solidity ^0.4.2;

contract UserRegistry {
	struct User {
        bool isDistributor;
        bool initialized;
        uint promotersFee; //fee that the promoter takes from the markup
        bytes32 ipfsHash; //hash linking to users profile, if any
        uint ticketsBought; //total number of tickets bought for this user
        string name; //to be converted to an IPFS hash for off-chain storage
        string info; //to be converted to an IPFS hash for off-chain storage
        mapping(uint => uint) allottedQuantity; //number of tickets they are allowed to buy for that specific ticket type
        mapping(uint => uint) markup; //percent markup on the face value for that specific ticket type
    }

    mapping(address => User) users;
	  event SetUserDetails(address indexed userAddress, string name, string info);
		
	  function setUser(string name, string info) {
			if(!users[msg.sender].initialized) {
				users[msg.sender].name = name;
        users[msg.sender].info = info;
        SetUserDetails(msg.sender, name, info);
			} else {
				users[msg.sender] = User(false, true, 0, "", 0, name, info);
			}
    }

    function getUserAtAddresss(address userAddress) public constant returns(string, string) {
      require(users[userAddress].initialized);
      return (users[userAddress].name, users[userAddress].info);
    }
}
