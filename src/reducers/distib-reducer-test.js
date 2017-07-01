/* eslint-env jest */
import reducer from './distrib-reducer'
import * as types from '../actions/action-types'

describe('distrib-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: [],
			tixByDistrib: {}
		})
	})
	it(`should handle ${types.LOAD_DISTRIBS_SUCCESS}`, () => {})
	it(`should handle ${types.EVENT_PROJ_ADD_DISTRIB}`, () => {})
	it(`should handle ${types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN}`, () => {})
	it(`should handle ${types.EVENT_PROJ_SET_DISTRIB_FEE}`, () => {})
	it(`should handle ${types.EVENT_PROJ_SET_MARKUP}`, () => {})
})
