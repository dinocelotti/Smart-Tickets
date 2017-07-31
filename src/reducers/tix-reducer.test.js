/* eslint-env jest */
import reducer from './tix-reducer'
import types from '../actions/action-types'

describe('tix-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	const state = {
		byId: { TIXID00: { id: 'TIXID00' } },
		ids: ['TIXID00']
	}
	it(`should handle ${types.ADD_TIX}`, () => {
		expect(
			reducer(undefined, {
				type: types.ADD_TIX,
				payload: { tix: { id: 'TIXID00' } }
			})
		).toEqual(state)
	})
	const state2 = {
		...state,
		byId: {
			...state.byId,
			[state.ids[0]]: { ...state.byId[state.ids[0]], ipfsHash: 'IPFSHASH00' }
		}
	}
	it(`should handle ${types.ADD_IPFS_DETAILS_TO_TIX}`, () => {
		expect(
			reducer(state, {
				type: types.ADD_IPFS_DETAILS_TO_TIX,
				payload: { tix: { ipfsHash: 'IPFSHASH00', id: state.ids[0] } }
			})
		).toEqual(state2)
	})
	const state3 = {
		...state2,
		byId: {
			...state2.byId,
			[state2.ids[0]]: { ...state2.byId[state2.ids[0]], price: '1000' }
		}
	}
	it(`should handle ${types.SET_TIX_PRICE}`, () => {
		expect(
			reducer(state2, {
				type: types.SET_TIX_PRICE,
				payload: { tix: { priceInWei: '1000', id: state2.ids[0] } }
			})
		).toEqual(state3)
	})
	const state4 = {
		...state3,
		byId: {
			...state3.byId,
			[state3.ids[0]]: { ...state3.byId[state3.ids[0]], quantity: '50' }
		}
	}
	it(`should handle ${types.SET_TIX_QUANTITY}`, () => {
		expect(
			reducer(state3, {
				type: types.SET_TIX_QUANTITY,
				payload: { tix: { quantity: '50', id: state3.ids[0] } }
			})
		).toEqual(state4)
	})
})
