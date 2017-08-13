/* eslint-env jest */
import reducer from './distributor-reducer'
import types from '../actions/action-types'

describe('distributor-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: [],
			ticketsByDistributor: {}
		})
	})
	it(`should handle ${types.ADD_DISTRIBUTOR}`, () => {
		expect(
			reducer(undefined, {
				type: types.ADD_DISTRIBUTOR,
				payload: {
					distributor: { id: '0XDISTRIBUTOR00' },
					projectAddress: '0XPROJECTADDR1'
				}
			})
		).toEqual({
			byId: { '0XDISTRIBUTOR00': { id: '0XDISTRIBUTOR00' } },
			ids: ['0XDISTRIBUTOR00'],
			ticketsByDistributor: {}
		})
	})
	it(`should handle ${types.SET_DISTRIBUTOR_ALLOTTED_QUANTITY}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_DISTRIBUTOR_ALLOTTED_QUANTITY,
				payload: {
					distributor: { id: '0XDISTRIBUTOR00' },
					ticket: {
						id: '0XTICKETID',
						allottedQuantity: '50'
					}
				}
			})
		).toEqual({
			byId: {},
			ids: [],
			ticketsByDistributor: {
				'0XDISTRIBUTOR00': { '0XTICKETID': { allottedQuantity: '50' } }
			}
		})
	})
	it(`should handle ${types.SET_DISTRIBUTOR_FEE}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_DISTRIBUTOR_FEE,
				payload: {
					distributor: { id: '0XDISTRIBUTOR00', fee: '20' }
				}
			})
		).toEqual({
			byId: {
				'0XDISTRIBUTOR00': { fee: '20' }
			},
			ticketsByDistributor: {},
			ids: []
		})
	})
	it(`should handle ${types.SET_MARKUP}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_MARKUP,
				payload: {
					distributor: { id: '0XDISTRIBUTOR00' },
					ticket: {
						id: '0XTICKETID',
						markup: '75'
					}
				}
			})
		).toEqual({
			byId: {},
			ids: [],
			ticketsByDistributor: {
				'0XDISTRIBUTOR00': { '0XTICKETID': { markup: '75' } }
			}
		})
	})
})
