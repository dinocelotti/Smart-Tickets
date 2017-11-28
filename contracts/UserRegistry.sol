pragma solidity ^0.4.2;

contract UserRegistry {
	struct User {
        bool initialized;
        bytes32 ipfsHash; //hash linking to users profile, if any
        string name; //to be converted to an IPFS hash for off-chain storage
        string info; //to be converted to an IPFS hash for off-chain storage
        address userID; //users wallet address
    }

    mapping(address => User) users;
	  event SetUserDetails(address indexed userAddress, string name, string info);
		
	  function setUser(string name, string info) {
			if(!users[msg.sender].initialized) {
				users[msg.sender].name = name;
        users[msg.sender].info = info;
        SetUserDetails(msg.sender, name, info);
			}
    }

    function getUserAtAddresss(address userAddress) public constant returns(string, string) {
      require(users[userAddress].initialized);
      return (users[userAddress].name, users[userAddress].info);
    }
}
