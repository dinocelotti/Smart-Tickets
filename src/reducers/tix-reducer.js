import * as types from './../actions/action-types'
import { combineReducers } from 'redux'

const byId = (state = {}, action) => {
	switch (action.type) {
		case types.LOAD_TIX_SUCCESS:
			return {
				...state,
				...action.tix.reduce((total, t) => {
					total[t.id] = t
					return total
				}, {})
			}
		case types.EVENT_PROJ_ADD_TIX:
			return { ...state, [action.tix.id]: action.tix }
		case types.EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX:
			return { ...state, [action.tix.id]: { ...state[action.tix.id], ipfsHash: action.tix.ipfsHash } }
		case types.EVENT_PROJ_SET_TIX_PRICE:
			return { ...state, [action.tix.id]: { ...state[action.tix.id], price: action.tix.price } }
		case types.EVENT_PROJ_SET_TIX_QUANTITY:
			return { ...state, [action.tix.id]: { ...state[action.tix.id], quantity: action.tix.quantity } }
		default:
			return state
	}
}
const ids = (state = [], action) => {
	switch (action.type) {
		case types.LOAD_TIX_SUCCESS:
			return [...state, action.tix.map(({ id }) => id)]

		case types.EVENT_PROJ_ADD_TIX:
			return [...state, action.tix.id]

		default:
			return state
	}
}
export default combineReducers({ byId, ids })
