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
const tixByDistrib = (state = {}, { type, payload: { distrib, tix } = {} }) => {
	switch (type) {
		case types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN:
			return { ...state, [distrib.id]: ticketHandler(state[distrib.id], tix.id, 'allotQuan', tix.allotQuan) }
		case types.EVENT_PROJ_SET_DISTRIB_FEE:
			return { ...state, [distrib.id]: ticketHandler(state[distrib.id], tix.id, 'fee', tix.fee) }
		case types.EVENT_PROJ_SET_MARKUP:
			return { ...state, [distrib.id]: ticketHandler(state[distrib.id], tix.id, 'markup', tix.markup) }
		default:
			return state
	}
}
const ticketHandler = (state = {}, tixId, attrName, attrVal) => {
	return { ...state, [tixId]: { ...state[tixId], [attrName]: attrVal } }
}
const byId = (state = {}, { type, payload: { distribs, distrib } = {} }) => {
	switch (type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return {
				...state,
				...distribs.reduce((obj, distrib) => ({ ...obj, [distrib.id]: distrib }), {})
			}
		case types.EVENT_PROJ_ADD_DISTRIB:
			return { ...state, [distrib.id]: distrib }
		default:
			return state
	}
}
const ids = (state = [], { type, payload: { distribs, distrib } = {} }) => {
	switch (type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return [...new Set([...state, ...distribs.map(({ id }) => id)])]

		case types.EVENT_PROJ_ADD_DISTRIB:
			return [...new Set([...state, distrib.id])]

		default:
			return state
	}
}

export default combineReducers({ tixByDistrib, byId, ids })
