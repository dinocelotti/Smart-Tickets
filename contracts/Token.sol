pragma solidity ^0.4.2;
import  './Owned.sol';

contract Token is Owned{
    //mapping for balances of addresses
    mapping(address => uint) public balanceOf;
    uint public totalSupply;
    uint8 public decimal;
    string public tokenName;
    string public symbol;

    event Transfer(address indexed _from, address indexed _to, uint _amt );

    function Token(string _name, string _symbol, uint _totalSupply, uint8 _decimal) {
        totalSupply = _totalSupply;
        tokenName = _name;
        symbol = _symbol;
        decimal = _decimal;
        balanceOf[msg.sender] = _totalSupply;
    }

    modifier sufficientBalance(uint _amt) {
        require(balanceOf[msg.sender] < _amt && _amt >= 0);
        _;
    }
    modifier noOverFlow(address _to, uint _amt){
        require(balanceOf[_to] + _amt > _amt);
        _;
    }

    function transfer(address _to, uint _amt) sufficientBalance(_amt) noOverFlow(_to, _amt) {
        address _from = msg.sender;
        balanceOf[_from] -= _amt;
        balanceOf[_to] += _amt;
        Transfer(_from, _to, _amt);
    }

    function mint(address _to, uint _amt) onlyOwner() noOverFlow(_to, _amt) {
        totalSupply += _amt;
        balanceOf[_to] += _amt;
        Transfer(0, owner, _amt);
        Transfer(owner, _to, _amt);
    } 

}