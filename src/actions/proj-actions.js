import * as types from './action-types';
export function createProjSuccess(event) {
	return {
		type: types.CREATE_PROJ_SUCCESS,
		event
	};
}
export function loadProjsSuccess(event) {
	console.log(types.LOAD_PROJS_SUCCESS);
	return {
		type: types.LOAD_PROJS_SUCCESS,
		event
	};
}

export function getAssocProjsSuccess(assocProjs) {
	return {
		type: types.GET_ASSOC_PROJS_SUCCESS,
		assocProjs
	};
}
export function projResolverDeploySuccess(projResolverDeployed) {
	return {
		type: types.PROJ_RESOLVER_DEPLOYED_SUCCESS,
		projResolverDeployed
	};
}

export function eventProjCreated(event) {
	return { type: types.EVENT_PROJ_CREATED, event };
}
export function eventProjFinishStaging(event) {
	return { type: types.EVENT_PROJ_FINISH_STAGING, event };
}
export function eventProjStartPublicFunding(event) {
	return { type: types.EVENT_PROJ_START_PUBLIC_FUNDING, event };
}
export function eventProjSetTixPrice(event) {
	return { type: types.EVENT_PROJ_SET_TIX_PRICE, event };
}
export function eventProjSetTixQuantity(event) {
	return { type: types.EVENT_PROJ_SET_TIX_QUANTITY, event };
}
export function eventProjSetDistrib(event) {
	return { type: types.EVENT_PROJ_SET_DISTRIB, event };
}
export function eventProjSetDistribAllotQuan(event) {
	return { type: types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN, event };
}
export function eventProjSetDistribFee(event) {
	return { type: types.EVENT_PROJ_SET_DISTRIB_FEE, event };
}
export function eventProjSetMarkup(event) {
	return { type: types.EVENT_PROJ_SET_MARKUP, event };
}
export function eventProjBuyTixFromPromo(event) {
	return { type: types.EVENT_PROJ_BUY_TIX_FROM_PROMO, event };
}
export function eventProjBuyTixFromDistrib(event) {
	return { type: types.EVENT_PROJ_BUY_TIX_FROM_DISTRIB, event };
}
export function eventProjWithdraw(event) {
	return { type: types.EVENT_PROJ_WITHDRAW, event };
}

export function eventProjResolverAddAddr(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event };
}
export function eventProjResolverAddProj(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event };
}
