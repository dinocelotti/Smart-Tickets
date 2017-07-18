import * as types from './action-types'
const web3Connected = () => ({ type: types.WEB3_CONNECTED })
const projResolverDeployed = () => ({ type: types.PROJ_RESOLVER_DEPLOYED })

export default { web3Connected, projResolverDeployed }
