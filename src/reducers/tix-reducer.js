import * as types from './../actions/action-types'
import { combineReducers } from 'redux'

const byId = (state = {}, { type, payload: { tix } = {} }) => {
	switch (type) {
		case types.LOAD_TIX_SUCCESS:
			return {
				...state,
				...tix.reduce((total, t) => {
					total[t.id] = t
					return total
				}, {})
			}
		case types.EVENT_PROJ_ADD_TIX:
			return { ...state, [tix.id]: tix }
		case types.EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX:
			return { ...state, [tix.id]: { ...state[tix.id], ipfsHash: tix.ipfsHash } }
		case types.EVENT_PROJ_SET_TIX_PRICE:
			return { ...state, [tix.id]: { ...state[tix.id], price: tix.price } }
		case types.EVENT_PROJ_SET_TIX_QUANTITY:
			return { ...state, [tix.id]: { ...state[tix.id], quantity: tix.quantity } }
		default:
			return state
	}
}
const ids = (state = [], { type, payload: { tix } = {} }) => {
	switch (type) {
		case types.LOAD_TIX_SUCCESS:
			return [...new Set([...state, ...tix.map(({ id }) => id)])]

		case types.EVENT_PROJ_ADD_TIX:
			return [...new Set([...state, tix.id])]

		default:
			return state
	}
}
export default combineReducers({ byId, ids })
