import * as types from './action-types'
export function createProjSuccess(projs) {
	return {
		type: types.CREATE_PROJ_SUCCESS,
		projs
	}
}
export function loadProjsSuccess(projs) {
	console.log(types.LOAD_PROJS_SUCCESS)
	return {
		type: types.LOAD_PROJS_SUCCESS,
		projs
	}
}

export function getAssocProjsSuccess(assocProjs) {
	return {
		type: types.GET_ASSOC_PROJS_SUCCESS,
		assocProjs
	}
}
export function projResolverDeploySuccess(projResolverDeployed) {
	return {
		type: types.PROJ_RESOLVER_DEPLOYED_SUCCESS,
		projResolverDeployed
	}
}
