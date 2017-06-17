import * as types from './../actions/action-types'
const initialState = {
	projResolverDeployed: false,
	projsByAddr: {},
	projs: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		//when we load the projs, replace the existing sprojs
		case types.LOAD_PROJS_SUCCESS:
			let nextState = { projsByAddr: {}, projs: [] }

			//make a map with the key being an address, value being the proj data
			nextState.projsByAddr = action.projs.reduce((prev, proj) => {
				//push onto the array for relational lookup later on
				nextState.projs.push(proj.addr)

				return Object.assign({}, prev, { [proj.addr]: proj })
			}, {})

			//return this new state
			return Object.assign({}, state, nextState)

		case types.PROJ_RESOLVER_DEPLOYED_SUCCESS:
			return Object.assign({}, state, { projResolverDeployed: action.projResolverDeployed })

		case types.EVENT_PROJ_CREATED:
			break

		case types.EVENT_PROJ_FINISH_STAGING:
		case types.EVENT_PROJ_START_PUBLIC_FUNDING:
			return stateHandler(action.type, state, action.event)

		case types.LOAD_TIX_SUCCESS:
			return (() => {
				let newState = { ...state }
				let addr = getProjAddrFromTixOrDistrib(action.tix[0])
				newState.projsByAddr[addr].tix = action.tix
				return newState
			})()

		case types.EVENT_PROJ_ADD_TIX:
			return (() => {
				let newState = { ...state }
				let addr = getProjAddrFromTixOrDistrib(action.tix)
				newState.projsByAddr[addr].tix.push(action.tix)
				return newState
			})()
		case types.LOAD_DISTRIBS_SUCCESS:
			return (() => {
				let newState = { ...state }
				let addr = getProjAddrFromTixOrDistrib(action.distribs[0])
				newState.projsByAddr[addr].distribs = action.distribs
				return newState
			})()
		case types.EVENT_PROJ_ADD_DISTRIB:
			return (() => {
				let newState = { ...state }
				let addr = getProjAddrFromTixOrDistrib(action.distrib)
				newState.projsByAddr[addr].distribs.push(action.distrib)
				return newState
			})()
		case types.EVENT_PROJ_BUY_TIX_FROM_PROMO:
		case types.EVENT_PROJ_BUY_TIX_FROM_DISTRIB:
			return buyHandler(action.type, state, action.event)
		case types.EVENT_PROJ_WITHDRAW:
			break
		case types.EVENT_PROJ_RESOLVER_ADD_ADDR:
		case types.EVENT_PROJ_RESOLVER_ADD_PROJ:
			break
		default:
	}
	return state
}
function getProjAddrFromTixOrDistrib(tixOrDistrib) {
	return tixOrDistrib.split('_')[0]
}
/**
 * 		projName: await proj.projName.call(),
		totalTixs: (await proj.totalTixs.call()).toString(),
		consumMaxTixs: (await proj.comsumMaxTixs.call()).toString(),
		state: await getState(proj),
		promoAddr: await proj.promo.call(),
		addr: proj.address
 */
function stateHandler(type, prevState, { address }) {
	let nextState = { ...prevState }
	if (type === types.EVENT_PROJ_FINISH_STAGING) {
		nextState.projsByAddr[address].state = 'Private Funding'
	} else if (types === types.EVENT_PROJ_START_PUBLIC_FUNDING) {
		nextState.projsByAddr[address].state = 'Public Funding'
	}
	return nextState
}

function buyHandler(type, prevState, { address, args }) {}
