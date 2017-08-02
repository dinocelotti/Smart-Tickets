import types from './action-types'
const web3Connected = () => ({ type: types.WEB3_CONNECTED })
const projectResolverDeployed = () => ({
	type: types.PROJECT_RESOLVER_DEPLOYED
})

export default { web3Connected, projectResolverDeployed }
