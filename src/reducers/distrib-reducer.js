import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
/**
 * Tickets {
 *	[distribId]: {
	 [ticketId]{
		 allotQuan: 123,
		 fee: 124
		 markup: 324
	 }
 }
 * }

 */
const tixByDistrib = (state = {}, action) => {
	const { tix, distrib } = action
	switch (action.type) {
		case types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN:
			return { ...state, [distrib.addr]: ticketHandler(state[distrib.addr], tix.id, 'allotQuan', tix.allotQuan) }
		case types.EVENT_PROJ_SET_DISTRIB_FEE:
			return { ...state, [distrib.addr]: ticketHandler(state[distrib.addr], tix.id, 'fee', tix.fee) }
		case types.EVENT_PROJ_SET_MARKUP:
			return { ...state, [distrib.addr]: ticketHandler(state[distrib.addr], tix.id, 'markup', tix.markup) }
		default:
			return state
	}
}
const ticketHandler = (state = {}, tixId, attrName, attrVal) => {
	return { ...state, [tixId]: { ...state[tixId], [attrName]: attrVal } }
}
const byId = (state = {}, action) => {
	switch (action.type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return {
				...state,
				...action.distribs.reduce((total, distrib) => {
					total[distrib.addr] = distrib
					return total
				}, {})
			}
		case types.EVENT_PROJ_ADD_DISTRIB:
			if (action.distrib) {
				return { ...state, [action.distrib.addr]: action.distrib }
			}
			return state
		default:
			return state
	}
}
const ids = (state = [], action) => {
	switch (action.type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return [...state, action.distribs.map(({ id }) => id)]

		case types.EVENT_PROJ_ADD_DISTRIB:
			return [...state, action.distrib.addr]

		default:
			return state
	}
}

export default combineReducers({ tixByDistrib, byId, ids })
