pragma solidity ^0.4.2;

contract ProjResolver {
    string  public resolverName;
    address public resolverAddress;
    address[] public projs;
    // address => id # of proj => proj address 
    // 1:1 mapping, id # of proj  == numProjsOf
    mapping  (address => mapping(uint256 => address)) public projsAssocOf;
    // address => # of projs they're associated with
    mapping  (address => uint256) public numProjsOf;
    //TODO: Attach proj firing for added contracts so we dont need to re-query for new projs

    event AddAddr(address indexed _addr, address _contract );
    event AddProj(address _proj);

    function ProjResolver(string _name) {
        resolverName = _name;
        resolverAddress = msg.sender;
    }
    function addAddr(address _proj) {
        uint256 newProjId = numProjsOf[msg.sender]++;
        projsAssocOf[msg.sender][newProjId] = _proj;
        AddAddr(msg.sender, _proj);
    }
    function addProj(address _proj){
        projs.push(_proj);
        AddProj(_proj);
    }
    function getProjsAssoc(uint _index) constant returns (address){
        return projsAssocOf[msg.sender][_index];
    }
    function getProjsLen() constant returns (uint){
        return projs.length;
    }
    function getNumProjsOf() constant returns (uint){
        return numProjsOf[msg.sender];
    }
}