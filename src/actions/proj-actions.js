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
const getId = (data, addr) => `${data.distrib || data.typeOfTix}_${addr}`
//TODO: add addr to object
export function Created({ data, addr }) {
	return { type: types.CREATED, payload: { proj: { ...data, addr } } }
}
export function FinishStaging(proj) {
	return { type: types.FINISH_STAGING, payload: { proj } }
}
export function StartPublicFunding(proj) {
	return { type: types.START_PUBLIC_FUNDING, payload: { proj } }
}
export function AddTix({ data, addr }) {
	return {
		type: types.ADD_TIX,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
export function AddIpfsDetailsToTix({ data, addr }) {
	return {
		type: types.ADD_IPFS_DETAILS_TO_TIX,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
export function SetTixPrice({ data, addr }) {
	return {
		type: types.SET_TIX_PRICE,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
export function SetTixQuantity({ data, addr }) {
	return {
		type: types.SET_TIX_QUANTITY,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}

export function AddDistrib({ data, addr }) {
	return {
		type: types.ADD_DISTRIB,
		payload: { proj: { addr }, distrib: { id: getId(data, addr), ...data } }
	}
}
export function SetDistribAllotQuan({ data, addr }) {
	return {
		type: types.SET_DISTRIB_ALLOT_QUAN,
		payload: {
			proj: { addr },
			distrib: {
				id: getId(data, addr),
				...data
			},
			tix: {
				id: getId({ typeOfTix: data.typeOfTix }, addr),
				allotQuan: data.allotQuan
			}
		}
	}
}
//set the promo fee for a distrib
export function SetDistribFee({ data, addr }) {
	return {
		type: types.SET_DISTRIB_FEE,
		payload: {
			proj: { addr },
			distrib: { id: getId(data, addr), ...data }
		}
	}
}
export function SetMarkup({ data, addr }) {
	return {
		type: types.SET_MARKUP,
		payload: {
			proj: { addr },
			distrib: { id: getId(data, addr), ...data },
			tix: { id: getId({ typeOfTix: data.typeOfTix }, addr), fee: data.markup }
		}
	}
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
