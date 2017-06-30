/* eslint-env jest */
import reducer from './distrib-reducer'
import * as types from '../actions/action-types'

describe('acct-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	it(`should handle ${types.GET_ACCTS_SUCCESS}`, () => {
		let response = {
			type: types.GET_ACCTS_SUCCESS,
			payload: {
				accts: [
					{ addr: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4', balance: '1500' },
					{ addr: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4', balance: '1243' }
				]
			}
		}
		expect(reducer(undefined, response)).toEqual({
			byId: {
				'0x0088063e1748489D4a5D2CC63e50e3159c005Fd4': {
					addr: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
					balance: '1500'
				},
				'0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4': {
					addr: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4',
					balance: '1243'
				}
			},
			ids: ['0x0088063e1748489D4a5D2CC63e50e3159c005Fd4', '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4']
		})
	})
})
