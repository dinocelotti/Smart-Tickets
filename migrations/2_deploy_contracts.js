const ProjResolver = artifacts.require('./ProjectResolver.sol')
module.exports = function(deployer) {
	deployer.deploy(ProjResolver, 'Default_Event_Resolver')
}
