import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj } from './reducer-helpers'
const { LOAD_PROJS_SUCCESS, LOAD_DISTRIBS_SUCCESS, LOAD_TIX_SUCCESS } = types
const { CREATED, FINISH_STAGING, START_PUBLIC_FUNDING } = types
const { ADD_TIX, ADD_DISTRIB } = types
const { BUY_TIX_FROM_PROMO, BUY_TIX_FROM_DISTRIB, WITHDRAW } = types
const { RESOLVER_ADD_ADDR, RESOLVER_ADD_PROJ } = types
const byIdObj = {
	[LOAD_PROJS_SUCCESS]: (state, { payload: { projs } }) => ({
		...state,
		...projs.reduce((obj, proj) => ({ ...obj, [proj.addr]: proj }), {})
	}),
	[LOAD_DISTRIBS_SUCCESS]: (state, { payload: { distribs, proj } }) => {
		const prevProj = state[proj.addr]
		const newDistribs = distribs.map(({ id }) => id)
		const projToAdd = {
			...prevProj,
			distribs: [...prevProj.distribs, ...newDistribs]
		}
		return { ...state, [proj.addr]: projToAdd }
	},
	[LOAD_TIX_SUCCESS]: (state, { payload: { proj, tix } }) => ({
		...state,
		[proj.addr]: { ...state[proj.addr], tix }
	}),
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
	},
	[RESOLVER_ADD_ADDR]: (state, action) => {
		return { ...state }
	},
	[RESOLVER_ADD_PROJ]: (state, action) => {
		return { ...state }
	}
}

const idsObj = {
	[LOAD_PROJS_SUCCESS]: (state, { payload: { projs } }) => [
		...new Set([...state, ...projs.map(({ addr }) => addr)])
	],
	[CREATED]: (state, { payload: { proj } }) => [
		...new Set([...state, proj.addr])
	]
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])

export default combineReducers({ ids, byId })
