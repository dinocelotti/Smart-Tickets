let EventResolver = artifacts.require("./EventResolver.sol");
module.exports = function(deployer) {
  deployer.deploy(EventResolver, "Default_Event_Resolver");
};
