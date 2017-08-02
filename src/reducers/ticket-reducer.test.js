/* eslint-env jest */
import reducer from './ticket-reducer'
import types from '../actions/action-types'

describe('ticket-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	const state = {
		byId: { TICKETID00: { id: 'TICKETID00' } },
		ids: ['TICKETID00']
	}
	it(`should handle ${types.ADD_TICKET}`, () => {
		expect(
			reducer(undefined, {
				type: types.ADD_TICKET,
				payload: { ticket: { id: 'TICKETID00' } }
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
	it(`should handle ${types.ADD_IPFS_DETAILS_TO_TICKET}`, () => {
		expect(
			reducer(state, {
				type: types.ADD_IPFS_DETAILS_TO_TICKET,
				payload: { ticket: { ipfsHash: 'IPFSHASH00', id: state.ids[0] } }
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
	it(`should handle ${types.SET_TICKET_PRICE}`, () => {
		expect(
			reducer(state2, {
				type: types.SET_TICKET_PRICE,
				payload: { ticket: { priceInWei: '1000', id: state2.ids[0] } }
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
	it(`should handle ${types.SET_TICKET_QUANTITY}`, () => {
		expect(
			reducer(state3, {
				type: types.SET_TICKET_QUANTITY,
				payload: { ticket: { quantity: '50', id: state3.ids[0] } }
			})
		).toEqual(state4)
	})
})
