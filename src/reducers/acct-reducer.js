import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
const byId = (state = {}, { type, payload }) => {
	switch (type) {
		case types.GET_ACCTS_SUCCESS:
			return {
				...state,
				...payload.accts.reduce((total, acct) => {
					total[acct.addr] = acct
					return total
				}, {})
			}
		case types.GET_ASSOC_PROJS_SUCCESS:
			return {
				...state,
				...payload.assocProjs.reduce((obj, { acct, assocProjs }) => {
					obj[acct] = { ...state[acct], assocProjs }
					return obj
				}, {})
			}

		default:
			return state
	}
}
const ids = (state = [], { type, payload }) => {
	switch (type) {
		case types.GET_ACCTS_SUCCESS:
			return [...state, ...payload.accts.map(({ addr }) => addr)]
		default:
			return state
	}
}
export default combineReducers({ byId, ids })
