let ProjResolver = artifacts.require('./ProjResolver.sol');
module.exports = function(deployer) {
	deployer.deploy(ProjResolver, 'Default_Event_Resolver');
};
