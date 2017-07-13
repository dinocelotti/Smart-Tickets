import * as types from './action-types'
export function event_createProj({ proj }) {
	return {
		type: types.CREATED,
		payload: { proj }
	}
}
export function loadProjsSuccess({ projs }) {
	return {
		type: types.LOAD_PROJS_SUCCESS,
		payload: { projs }
	}
}
export function loadDistribsSuccess({ projAddr, distribs }) {
	return {
		type: types.LOAD_DISTRIBS_SUCCESS,
		distribs,
		proj: { addr: projAddr }
	}
}

export function loadTixSuccess({ projAddr, tix }) {
	return {
		type: types.LOAD_TIX_SUCCESS,
		tix,
		proj: { addr: projAddr }
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

//TODO: add addr to object
export function Created(proj) {
	return { type: types.CREATED, payload: { proj } }
}
export function FinishStaging(proj) {
	return { type: types.FINISH_STAGING, payload: { proj } }
}
export function StartPublicFunding(proj) {
	return { type: types.START_PUBLIC_FUNDING, payload: { proj } }
}
export function AddTix(tix) {
	return { type: types.ADD_TIX, payload: { tix } }
}
export function AddIpfsDetailsToTix(tix) {
	return { type: types.ADD_IPFS_DETAILS_TO_TIX, payload: { tix } }
}
export function SetTixPrice(tix) {
	return { type: types.SET_TIX_PRICE, payload: { tix } }
}
export function SetTixQuantity(tix) {
	return { type: types.SET_TIX_QUANTITY, payload: { tix } }
}

export function AddDistrib(distrib) {
	return { type: types.SET_DISTRIB, payload: { distrib } }
}
export function SetDistribAllotQuan(distrib) {
	return { type: types.SET_DISTRIB_ALLOT_QUAN, payload: { distrib } }
}
export function SetDistribFee(distrib) {
	return { type: types.SET_DISTRIB_FEE, payload: { distrib } }
}
export function SetMarkup(distrib) {
	return { type: types.SET_MARKUP, payload: { distrib } }
}
export function BuyTixFromPromo(event) {
	return { type: types.BUY_TIX_FROM_PROMO, event }
}
export function BuyTixFromDistrib(event) {
	return { type: types.BUY_TIX_FROM_DISTRIB, event }
}
export function Withdraw(event) {
	return { type: types.WITHDRAW, event }
}

export function ResolverAddAddr(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event }
}
export function ResolverAddProj(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event }
}
