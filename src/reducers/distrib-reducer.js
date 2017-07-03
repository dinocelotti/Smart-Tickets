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
const tixByDistrib = (state = {}, { type, payload: { distribId, tix } = {} }) => {
	switch (type) {
		case types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN:
			return { ...state, [distribId]: ticketHandler(state[distribId], tix.id, 'allotQuan', tix.allotQuan) }
		case types.EVENT_PROJ_SET_DISTRIB_FEE:
			return { ...state, [distribId]: ticketHandler(state[distribId], tix.id, 'fee', tix.fee) }
		case types.EVENT_PROJ_SET_MARKUP:
			return { ...state, [distribId]: ticketHandler(state[distribId], tix.id, 'markup', tix.markup) }
		default:
			return state
	}
}
const ticketHandler = (state = {}, tixId, attrName, attrVal) => {
	return { ...state, [tixId]: { ...state[tixId], [attrName]: attrVal } }
}
const byId = (state = {}, { type, payload: { distribs, distribId } = {} }) => {
	switch (type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return {
				...state,
				...distribs.reduce((obj, distribId) => {
					obj[distribId] = distribId
					return obj
				}, {})
			}
		case types.EVENT_PROJ_ADD_DISTRIB:
			return { ...state, [distribId]: distribId }
		default:
			return state
	}
}
const ids = (state = [], { type, payload: { distribs, distribId } = {} }) => {
	switch (type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			return [...new Set([...state, ...distribs.map(id => id)])]

		case types.EVENT_PROJ_ADD_DISTRIB:
			return [...new Set([...state, distribId])]

		default:
			return state
	}
}

export default combineReducers({ tixByDistrib, byId, ids })
