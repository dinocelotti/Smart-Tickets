import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { GET_ACCTS_SUCCESS, GET_ASSOC_PROJS_SUCCESS } = types
const byIdObj = {
	[GET_ACCTS_SUCCESS]: (state, { payload: { accts } }) => ({
		...state,
		...accts.reduce((obj, acc) => ({ ...obj, [acc.addr]: acc }), {})
	}),
	[GET_ASSOC_PROJS_SUCCESS]: (state, { payload: { assocProjs } }) => ({
		...state,
		...assocProjs.reduce(
			(obj, { acct, assocProjs }) => ({
				...obj,
				[acct]: { ...state[acct], assocProjs }
			}),
			{}
		)
	})
}

const idsObj = {
	[GET_ACCTS_SUCCESS]: (state, { payload: { accts } }) =>
		makeNewSet(state, accts.map(({ addr }) => addr)),
	[GET_ASSOC_PROJS_SUCCESS]: (state, { payload: { assocProjs } }) =>
		makeNewSet(state, assocProjs.map(({ acct }) => acct))
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])
export default combineReducers({ byId, ids })
