import types from './action-types'
export default {
	event_createProj,
	loadProjsSuccess,
	loadDistribsSuccess,
	loadTixSuccess,
	getAssocProjsSuccess,
	projResolverDeploySuccess,
	Created,
	FinishStaging,
	StartPublicFunding,
	AddTix,
	AddIpfsDetailsToTix,
	SetTixPrice,
	SetTixQuantity,
	AddDistrib,
	SetDistribAllotQuan,
	SetDistribFee,
	SetMarkup,
	BuyTixFromPromo,
	BuyTixFromDistrib,
	Withdraw,
	ResolverAddAddr,
	ResolverAddProj
}
function event_createProj({ proj }) {
	return {
		type: types.CREATED,
		payload: { proj }
	}
}
function loadProjsSuccess({ projs }) {
	return {
		type: types.LOAD_PROJS_SUCCESS,
		payload: { projs }
	}
}
function loadDistribsSuccess({ projAddr, distribs }) {
	return {
		type: types.LOAD_DISTRIBS_SUCCESS,
		distribs,
		proj: { addr: projAddr }
	}
}

function loadTixSuccess({ projAddr, tix }) {
	return {
		type: types.LOAD_TIX_SUCCESS,
		tix,
		proj: { addr: projAddr }
	}
}

function getAssocProjsSuccess(assocProjs) {
	return {
		type: types.GET_ASSOC_PROJS_SUCCESS,
		assocProjs
	}
}
function projResolverDeploySuccess(projResolverDeployed) {
	return {
		type: types.PROJ_RESOLVER_DEPLOYED_SUCCESS,
		projResolverDeployed
	}
}
const getId = (data, addr) => `${data.distrib || data.typeOfTix}_${addr}`
//TODO: add addr to object
function Created({ data, addr }) {
	return { type: types.CREATED, payload: { proj: { ...data, addr } } }
}
function FinishStaging(proj) {
	return { type: types.FINISH_STAGING, payload: { proj } }
}
function StartPublicFunding(proj) {
	return { type: types.START_PUBLIC_FUNDING, payload: { proj } }
}
function AddTix({ data, addr }) {
	return {
		type: types.ADD_TIX,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
function AddIpfsDetailsToTix({ data, addr }) {
	return {
		type: types.ADD_IPFS_DETAILS_TO_TIX,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
function SetTixPrice({ data, addr }) {
	return {
		type: types.SET_TIX_PRICE,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}
function SetTixQuantity({ data, addr }) {
	return {
		type: types.SET_TIX_QUANTITY,
		payload: { proj: { addr }, tix: { id: getId(data, addr), ...data } }
	}
}

function AddDistrib({ data, addr }) {
	return {
		type: types.ADD_DISTRIB,
		payload: { proj: { addr }, distrib: { id: getId(data, addr), ...data } }
	}
}
function SetDistribAllotQuan({ data, addr }) {
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
function SetDistribFee({ data, addr }) {
	return {
		type: types.SET_DISTRIB_FEE,
		payload: {
			proj: { addr },
			distrib: { id: getId(data, addr), ...data }
		}
	}
}
function SetMarkup({ data, addr }) {
	return {
		type: types.SET_MARKUP,
		payload: {
			proj: { addr },
			distrib: { id: getId(data, addr), ...data },
			tix: { id: getId({ typeOfTix: data.typeOfTix }, addr), fee: data.markup }
		}
	}
}
function BuyTixFromPromo(event) {
	return { type: types.BUY_TIX_FROM_PROMO, event }
}
function BuyTixFromDistrib(event) {
	return { type: types.BUY_TIX_FROM_DISTRIB, event }
}
function Withdraw(event) {
	return { type: types.WITHDRAW, event }
}

function ResolverAddAddr(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event }
}
function ResolverAddProj(event) {
	return { type: types.CREATE_PROJ_SUCCESS, event }
}
