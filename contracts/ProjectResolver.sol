pragma solidity ^0.4.2;

contract ProjectResolver {
    string  public resolverName;
    address public resolverAddress;
    address[] public projects;
    // address => id # of proj => proj address 
    // 1:1 mapping, id # of proj  == numberProjectssOf
    mapping  (address => mapping(uint256 => address)) projectsAssociatedOf;
    // address => # of projects they're associated with
    mapping  (address => uint256) numberProjectssOf;
    //TODO: Attach proj firing for added contracts so we dont need to re-query for new projects

    event AddAddress(address indexed _address, address _contract );
    event AddProject(address _project);

    function ProjectResolver(string _name) {
        resolverName = _name;
        resolverAddress = msg.sender;
    }
    function addAddress(address _project) {
        uint256 newProjId = numberProjectssOf[msg.sender]++;
        projectsAssociatedOf[msg.sender][newProjId] = _project;
        AddAddress(msg.sender, _project);
    }
    function addProject(address _project) {
        projects.push(_project);
        AddProject(_project);
    }
    function getProjectsAssociated(uint _index) constant returns (address){
        return projectsAssociatedOf[msg.sender][_index];
    }
    function getProjectsLength() constant returns (uint){
        return projects.length;
    }
    function getNumberProjectsOf() constant returns (uint){
        return numberProjectssOf[msg.sender];
    }
}