/* eslint-env jest */
import reducer from './account-reducer'
import types from '../actions/action-types'
describe('account-reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual({ byId: {}, ids: [] })
	})
	it(`should handle ${types.GET_ACCOUNTS_SUCCESS}`, () => {
		expect(
			reducer(undefined, {
				type: types.GET_ACCOUNTS_SUCCESS,
				payload: {
					accounts: [
						{
							address: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
							balance: '1500'
						},
						{
							address: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4',
							balance: '1243'
						}
					]
				}
			})
		).toEqual({
			byId: {
				'0x0088063e1748489D4a5D2CC63e50e3159c005Fd4': {
					address: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
					balance: '1500'
				},
				'0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4': {
					address: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4',
					balance: '1243'
				}
			},
			ids: [
				'0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
				'0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4'
			]
		})
	})
})
