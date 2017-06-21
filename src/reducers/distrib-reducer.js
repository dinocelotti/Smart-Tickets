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
const byId = (state = {}, action) => {
	switch (action.type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return {
				...state,
				...action.distribs.reduce((total, distrib) => {
					total[distrib.id] = distrib
					return total
				}, {})
			}
		case types.EVENT_PROJ_ADD_DISTRIB:
			const { distrib } = action
			if (distrib) {
				return { ...state, [distrib.id]: distrib }
			}
			return state
		default:
			return state
	}
}
const ids = (state = [], action) => {
	switch (action.type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return [...state, action.distribs(distrib => distrib.id)]

		case types.EVENT_PROJ_ADD_DISTRIB:
			const { distrib } = action
			if (distrib) {
				return [...state, distrib.id]
			}
			return state
		default:
			return state
	}
}

export default combineReducers({ tixByDistrib, byId, ids })
