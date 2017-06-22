import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
const byId = (state = {}, action) => {
	switch (action.type) {
		case types.GET_ACCTS_SUCCESS:
			return {
				...state,
				...action.accts.reduce((total, acct) => {
					total[acct.addr] = acct
					return total
				}, {})
			}
		case types.GET_ASSOC_PROJS_SUCCESS:
			return {
				...state,
				...action.assocProjs.reduce((obj, { acct, aPjs }) => {
					obj[acct] = { ...state[acct], assocProjs: aPjs }
					return obj
				}, {})
			}

		default:
			return state
	}
}
const ids = (state = [], action) => {
	switch (action.type) {
		case types.GET_ACCTS_SUCCESS:
			return [...state, action.accts.map(({ addr }) => addr)]
		default:
			return state
	}
}
export default combineReducers({ byId, ids })
