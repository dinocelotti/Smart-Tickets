/* eslint-env jest */
import reducer from './tix-reducer'
import * as types from '../actions/action-types'

describe('tix-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	let state = {
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
	let state2 = {
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
	let state3 = {
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
				payload: { tix: { price: '1000', id: state2.ids[0] } }
			})
		).toEqual(state3)
	})
	let state4 = {
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
	it(`should handle ${types.LOAD_TIX_SUCCESS}`, () => {
		expect(
			reducer(
				{
					byId: { TIXID00: { id: 'TIXID00' } },
					ids: ['TIXID00']
				},
				{
					type: types.LOAD_TIX_SUCCESS,
					payload: {
						tix: [{ id: 'TIXID00' }, { id: 'TIXID01' }, { id: 'TIXID02' }]
					}
				}
			)
		).toEqual({
			byId: {
				TIXID00: {
					id: 'TIXID00'
				},
				TIXID01: {
					id: 'TIXID01'
				},
				TIXID02: {
					id: 'TIXID02'
				}
			},
			ids: ['TIXID00', 'TIXID01', 'TIXID02']
		})
	})
})
