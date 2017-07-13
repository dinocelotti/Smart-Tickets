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
	return { type: types.FINISH_STAGING, payload: proj }
}
export function StartPublicFunding(proj) {
	return { type: types.START_PUBLIC_FUNDING, payload: proj }
}
export function AddTix(proj) {
	return { type: types.ADD_TIX, payload: proj }
}
export function AddIpfsDetailsToTix(event) {
	return { type: types.ADD_IPFS_DETAILS_TO_TIX, event }
}
export function SetTixPrice(event) {
	return { type: types.SET_TIX_PRICE, event }
}
export function SetTixQuantity(event) {
	return { type: types.SET_TIX_QUANTITY, event }
}

export function AddDistrib(event) {
	return { type: types.SET_DISTRIB, event }
}
export function SetDistribAllotQuan(event) {
	return { type: types.SET_DISTRIB_ALLOT_QUAN, event }
}
export function SetDistribFee(event) {
	return { type: types.SET_DISTRIB_FEE, event }
}
export function SetMarkup(event) {
	return { type: types.SET_MARKUP, event }
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
