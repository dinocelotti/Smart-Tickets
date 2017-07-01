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
	it(`should handle ${types.EVENT_PROJ_ADD_TIX}`, () => {})
	it(`should handle ${types.EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX}`, () => {})
	it(`should handle ${types.EVENT_PROJ_SET_TIX_PRICE}`, () => {})
	it(`should handle ${types.EVENT_PROJ_SET_TIX_QUANTITY}`, () => {})
	it(`should handle ${types.LOAD_TIX_SUCCESS}`, () => {})
})
