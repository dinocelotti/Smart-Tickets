import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { CREATED, FINISH_STAGING, START_PUBLIC_FUNDING } = types
const { ADD_TIX, ADD_DISTRIB } = types
const { BUY_TIX_FROM_PROMO, BUY_TIX_FROM_DISTRIB, WITHDRAW } = types
const byIdObj = {
	[CREATED]: (state, { payload: { proj } }) => ({
		...state,
		[proj.addr]: { state: 'Setup', tix: [], distribs: [], ...proj }
	}),
	[FINISH_STAGING]: (state, { payload: { proj } }) => ({
		...state,
		[proj.addr]: { ...state[proj.addr], state: 'Private Funding' }
	}),
	[START_PUBLIC_FUNDING]: (state, { payload: { proj } }) => ({
		...state,
		[proj.addr]: { ...state[proj.addr], state: 'Public Funding' }
	}),
	[ADD_TIX]: (state, { payload: { proj, tix: tixToAdd } }) => {
		const prevProj = state[proj.addr]
		const prevTix = prevProj.tix
		const nextTix = [...prevTix, tixToAdd.id]
		const projToAdd = { ...prevProj, tix: nextTix }
		return { ...state, [proj.addr]: projToAdd }
	},
	[ADD_DISTRIB]: (state, { payload: { proj, distrib: distribToAdd } }) => {
		const prevProj = state[proj.addr]
		const prevDistribs = prevProj.distribs
		const nextDistribs = [...prevDistribs, distribToAdd.id]
		const projToAdd = { ...prevProj, distribs: nextDistribs }
		return { ...state, [proj.addr]: projToAdd }
	},
	[BUY_TIX_FROM_PROMO]: (state, action) => {
		return { ...state }
	},
	[WITHDRAW]: (state, action) => {
		return { ...state }
	},
	[BUY_TIX_FROM_DISTRIB]: (state, action) => {
		return { ...state }
	}
}

const idsObj = {
	[CREATED]: (state, { payload: { proj } }) => makeNewSet(state, [proj.addr])
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])

export default combineReducers({ ids, byId })
