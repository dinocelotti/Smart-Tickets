import * as types from './../actions/action-types'
import { combineReducers } from 'redux'

const byId = (state = {}, action) => {
	switch (action.type) {
		case types.LOAD_PROJS_SUCCESS:
			return {
				...state,
				...action.projs.reduce((obj, proj) => {
					obj[proj.addr] = proj
					return obj
				}, {})
			}
		case types.EVENT_PROJ_CREATED:
			return { ...state, [action.proj.addr]: action.proj }

		case types.EVENT_PROJ_FINISH_STAGING:
			return { ...state, [action.proj.addr]: { ...state[action.proj.addr], state: 'Private Funding' } }
		case types.EVENT_PROJ_START_PUBLIC_FUNDING:
			return { ...state, [action.proj.addr]: { ...state[action.proj.addr], state: 'Public Funding' } }

		case types.LOAD_TIX_SUCCESS:
			return { ...state, [action.proj.addr]: { ...state[action.proj.addr], tix: action.tix } }

		case types.EVENT_PROJ_ADD_TIX:
			return {
				...state,
				[action.proj.addr]: { ...state[action.proj.addr], tix: [...state[action.proj.addr].tix, action.tix] }
			}
		case types.LOAD_DISTRIBS_SUCCESS:
			return { ...state, [action.proj.addr]: { ...state[action.proj.addr], distribs: action.distribs } }
		case types.EVENT_PROJ_ADD_DISTRIB:
			return {
				...state,
				[action.proj.addr]: {
					...state[action.proj.addr],
					distribs: [...state[action.proj.addr].distribs, action.distrib]
				}
			}
		//TODO: implement these
		case types.EVENT_PROJ_BUY_TIX_FROM_PROMO:
		case types.EVENT_PROJ_BUY_TIX_FROM_DISTRIB:
		case types.EVENT_PROJ_WITHDRAW:
		case types.EVENT_PROJ_RESOLVER_ADD_ADDR:
		case types.EVENT_PROJ_RESOLVER_ADD_PROJ:
			return state

		default:
			return state
	}
}
const ids = (state = [], action) => {
	switch (action.type) {
		case types.LOAD_PROJS_SUCCESS:
			return [...state, action.projs(({ id }) => id)]

		default:
			return state
	}
}
const projResolver = (state = { deployed: false }, action) => {
	switch (action.type) {
		case types.PROJ_RESOLVER_DEPLOYED_SUCCESS:
			return { ...state, deployed: true }

		default:
			return state
	}
}
export default combineReducers({ projResolver, ids, byId })
