import * as types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'

const { LOAD_TIX_SUCCESS } = types
const { ADD_TIX, ADD_IPFS_DETAILS_TO_TIX } = types
const { SET_TIX_PRICE, SET_TIX_QUANTITY } = types

const tixSetHelper = ({ attr, tixAttr }) => ({ state, tix }) => {
	const prevTix = state[tix.id]
	const nextTix = { ...prevTix, [attr]: tix[tixAttr] }
	return { ...state, [tix.id]: nextTix }
}

const byIdObj = {
	[LOAD_TIX_SUCCESS]: (state, { payload: { tix } }) => ({
		...state,
		...tix.reduce((obj, t) => ({ ...obj, [t.id]: t }), {})
	}),
	[ADD_TIX]: (state, { payload: { tix } }) => ({ ...state, [tix.id]: tix }),
	[ADD_IPFS_DETAILS_TO_TIX]: (state, { payload: { tix } }) => {
		const addIpfs = tixSetHelper({ attr: 'ipfsHash', tixAttr: 'ipfsHash' })
		return addIpfs({ state, tix })
	},
	[SET_TIX_PRICE]: (state, { payload: { tix } }) => {
		const setTixPrice = tixSetHelper({ attr: 'price', tixAttr: 'priceInWei' })
		return setTixPrice({ state, tix })
	},
	[SET_TIX_QUANTITY]: (state, { payload: { tix } }) => {
		const setTixQuantity = tixSetHelper({
			attr: 'quantity',
			tixAttr: 'quantity'
		})
		return setTixQuantity({ state, tix })
	}
}
const idsObj = {
	[LOAD_TIX_SUCCESS]: (state, { payload: { tix } }) =>
		makeNewSet(state, tix.map(({ id }) => id)),
	[ADD_TIX]: (state, { payload: { tix } }) => makeNewSet(state, [tix.id])
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])

export default combineReducers({ byId, ids })
