let Event = artifacts.require("./Event.sol");
module.exports = function(deployer) {
  deployer.deploy(Event, "GREAT EVENT", 5, 150, 3);
};
