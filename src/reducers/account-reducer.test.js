/* eslint-env jest */
import reducer from './account-reducer'
import types from '../actions/action-types'
import { accData } from './testData'
describe('account-reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual({ byId: {}, ids: [] })
	})
	it(`should handle ${types.GET_ACCOUNTS_SUCCESS}`, () => {
		expect(reducer(undefined, accData.getAccounts.action)).toEqual(
			accData.getAccounts.state
		)
	})
})
