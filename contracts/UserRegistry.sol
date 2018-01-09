pragma solidity ^0.4.2;

contract UserRegistry {
    struct User {
        bool initialized;
        bytes32 userName;
        string country;
        string city;
        bool canPromote;
    }

    mapping(address => User) users;
    mapping(bytes32 => address) addrForName;

    event NewUser(address userAddress, bytes32 userName);
    event UserDetails(address indexed userAddress, string country, string city, bool canPromote);
    
    function initUser(bytes32 _userName) public {
        //Check that the address is not yet initialized and the user name is not taken
        require(!users[msg.sender].initialized);
        require(addrForName[_userName] == 0);

        users[msg.sender].initialized = true;
        users[msg.sender].userName = _userName;
        addrForName[_userName] = msg.sender;

        NewUser(msg.sender, _userName);
    }

    function setUserDetails(string _country, string _city, bool _canPromote) public {
        require(users[msg.sender].initialized);

        users[msg.sender].country = _country;
        users[msg.sender].city = _city;
        users[msg.sender].canPromote = _canPromote;

        UserDetails(msg.sender, _country, _city, _canPromote);
    }

    function getNameAtAddresss(address userAddress) public view returns(bytes32) {
        require(users[userAddress].initialized);
        return (users[userAddress].userName);
    }

    function getAddressFromName(bytes32 _userName) public view returns(address) {
        require(users[addrForName[_userName]].initialized);
        return addrForName[_userName];
    }
}
