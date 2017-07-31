import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { SET_DISTRIB_ALLOT_QUAN, SET_MARKUP } = types
const { SET_DISTRIB_FEE, ADD_DISTRIB } = types
const ticketHandler = (state = {}, tixId, attrName, attrVal) => ({
	...state,
	[tixId]: { ...state[tixId], [attrName]: attrVal }
})
const tixByDistribObj = {
	[SET_DISTRIB_ALLOT_QUAN]: (state, { payload: { distrib, tix } }) => ({
		...state,
		[distrib.id]: ticketHandler(
			state[distrib.id],
			tix.id,
			'allotQuan',
			tix.allotQuan
		)
	}),
	[SET_MARKUP]: (state, { payload: { distrib, tix } }) => ({
		...state,
		[distrib.id]: ticketHandler(state[distrib.id], tix.id, 'markup', tix.markup)
	})
}
const byIdObj = {
	[SET_DISTRIB_FEE]: (state, { payload: { distrib } }) => ({
		...state,
		[distrib.id]: { ...state[distrib.id], fee: distrib.fee }
	}),
	[ADD_DISTRIB]: (state, { payload: { distrib } }) => ({
		...state,
		[distrib.id]: distrib
	})
}
const idsObj = {
	[ADD_DISTRIB]: (state, { payload: { distrib } }) =>
		makeNewSet(state, [distrib.id])
}

const tixByDistrib = createReducerFromObj(tixByDistribObj, {})
const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])
export default combineReducers({ tixByDistrib, byId, ids })
