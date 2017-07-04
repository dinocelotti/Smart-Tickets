import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
const byId = (state = {}, { type, payload: { accts, assocProjs } = {} }) => {
	switch (type) {
		case types.GET_ACCTS_SUCCESS:
			return {
				...state,
				...accts.reduce((total, acct) => ({ ...total, [acct.addr]: acct }), {})
			}
		case types.GET_ASSOC_PROJS_SUCCESS:
			return {
				...state,
				...assocProjs.reduce((obj, { acct, assocProjs }) => ({ ...obj, [acct]: { ...state[acct], assocProjs } }), {})
			}

		default:
			return state
	}
}
const ids = (state = [], { type, payload: { accts, assocProjs } = {} }) => {
	switch (type) {
		case types.GET_ACCTS_SUCCESS:
			return [...new Set([...state, ...accts.map(({ addr }) => addr)])]
		case types.GET_ASSOC_PROJS_SUCCESS:
			return [...new Set([...state, ...assocProjs.map(({ acct }) => acct)])]
		default:
			return state
	}
}
export default combineReducers({ byId, ids })
