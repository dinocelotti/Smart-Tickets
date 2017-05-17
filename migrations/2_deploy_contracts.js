var SimpleStorage = artifacts.require("./SimpleStorage.sol");
let Token = artifacts.require("./Token.sol");
let Event = artifacts.require("./Event.sol");
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  /*name, symbol, intial supply, decimal */
  deployer.deploy(Token, "MembranEnt", "MEME", 21000, 2);
  deployer.deploy(Event, "GREAT EVENT", 5, 150, 3);
};
