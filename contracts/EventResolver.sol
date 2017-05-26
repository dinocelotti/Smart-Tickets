pragma solidity ^0.4.2;

contract EventResolver {
    string  public resolverName;
    address public resolverAddress;
    // address => id # of event => event address 
    // 1:1 mapping, id # of event  == numEventsOf
    mapping  (address => mapping(uint256 => address)) public eventsAssociatedOf;
    // address => # of events they're associated with
    mapping  (address => uint256) public numEventsOf;

    event addressAssignedToContract(address indexed _addr, address _contract );

    function EventResolver(string _name) {
        resolverName = _name;
        resolverAddress = msg.sender;
    }
    function assignAddressToContract(address _contractAddress) {
        uint256 newEventId = numEventsOf[msg.sender]++;
        eventsAssociatedOf[msg.sender][newEventId] = _contractAddress;
        addressAssignedToContract(msg.sender, _contractAddress);
    }
}