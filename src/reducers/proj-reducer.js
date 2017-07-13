import * as types from './../actions/action-types'
import { combineReducers } from 'redux'

const byId = (
	state = {},
	{ type, payload: { projs, proj, tix, distribs, distrib } = {} }
) => {
	switch (type) {
		case types.LOAD_PROJS_SUCCESS:
			return {
				...state,
				...projs.reduce((obj, proj) => ({ ...obj, [proj.addr]: proj }), {})
			}
		case types.CREATED:
			return { ...state, [proj.addr]: proj }

		case types.FINISH_STAGING:
			return {
				...state,
				[proj.addr]: { ...state[proj.addr], state: 'Private Funding' }
			}
		case types.START_PUBLIC_FUNDING:
			return {
				...state,
				[proj.addr]: { ...state[proj.addr], state: 'Public Funding' }
			}

		case types.LOAD_TIX_SUCCESS:
			return { ...state, [proj.addr]: { ...state[proj.addr], tix } }

		case types.ADD_TIX:
			return {
				...state,
				[proj.addr]: {
					...state[proj.addr],
					tix: [...state[proj.addr].tix, tix]
				}
			}
		case types.LOAD_DISTRIBS_SUCCESS:
			return {
				...state,
				[proj.addr]: {
					...state[proj.addr],
					distribs: [
						...state[proj.addr].distribs,
						...distribs.map(({ id }) => id)
					]
				}
			}
		case types.ADD_DISTRIB:
			return {
				...state,
				[proj.addr]: {
					...state[proj.addr],
					distribs: [...state[proj.addr].distribs, distrib.id]
				}
			}
		//TODO: implement these
		case types.BUY_TIX_FROM_PROMO:
		case types.BUY_TIX_FROM_DISTRIB:
		case types.WITHDRAW:
		case types.RESOLVER_ADD_ADDR:
		case types.RESOLVER_ADD_PROJ:
			return state

		default:
			return state
	}
}
const ids = (state = [], { type, payload: { projs, proj } = {} }) => {
	switch (type) {
		case types.LOAD_PROJS_SUCCESS:
			return [...new Set([...state, ...projs.map(({ addr }) => addr)])]
		case types.CREATED:
			return [...new Set([...state, proj.addr])]
		default:
			return state
	}
}
const projResolver = (state = { deployed: false }, { type }) => {
	switch (type) {
		case types.PROJ_RESOLVER_DEPLOYED_SUCCESS:
			return { ...state, deployed: true }

		default:
			return state
	}
}
export default combineReducers({ projResolver, ids, byId })
