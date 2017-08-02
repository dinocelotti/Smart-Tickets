import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { GET_ACCOUNTS_SUCCESS } = types
const byIdObj = {
	[GET_ACCOUNTS_SUCCESS]: (state, { payload: { accounts } }) => ({
		...state,
		...accounts.reduce((obj, acc) => ({ ...obj, [acc.address]: acc }), {})
	})
}

const idsObj = {
	[GET_ACCOUNTS_SUCCESS]: (state, { payload: { accounts } }) =>
		makeNewSet(state, accounts.map(({ address }) => address))
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])
export default combineReducers({ ids, byId })
