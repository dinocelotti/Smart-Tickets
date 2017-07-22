/* eslint-env jest */
import reducer from './acct-reducer'
import types from '../actions/action-types'
import { accData } from './testData'
describe('acct-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual(accData.initial)
	})
	it(`should handle ${types.GET_ACCTS_SUCCESS}`, () => {
		expect(reducer(undefined, accData.getAccts.action)).toEqual(
			accData.getAccts.state
		)
	})
	it(`should handle ${types.GET_ASSOC_PROJS_SUCCESS}`, () => {
		expect(reducer(undefined, accData.getAssocProjs.action)).toEqual(
			accData.getAssocProjs.state
		)
	})
})
