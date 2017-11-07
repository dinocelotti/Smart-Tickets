const ProjResolver = artifacts.require('./ProjectResolver.sol');
const UserRegistry = artifacts.require('./UserRegistry.sol');

module.exports = function(deployer) {
  deployer.deploy(UserRegistry);
  deployer.deploy(ProjResolver, 'Default_Event_Resolver');
};
