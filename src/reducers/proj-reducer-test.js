/* eslint-env jest */
import reducer from './proj-reducer'
import * as types from '../actions/action-types'

describe('proj-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: [],
			projResolver: {}
		})
	})
	it(`should handle ${types.LOAD_PROJS_SUCCESS}`, () => {})
	it(`should handle ${types.EVENT_PROJ_CREATED}`, () => {})
	it(`should handle ${types.EVENT_PROJ_FINISH_STAGING}`, () => {})
	it(`should handle ${types.EVENT_PROJ_START_PUBLIC_FUNDING}`, () => {})
	it(`should handle ${types.LOAD_TIX_SUCCESS}`, () => {})
	it(`should handle ${types.EVENT_PROJ_ADD_TIX}`, () => {})
	it(`should handle ${types.LOAD_DISTRIBS_SUCCESS}`, () => {})
	it(`should handle ${types.EVENT_PROJ_ADD_DISTRIB}`, () => {})
	it(`should handle ${types.PROJ_RESOLVER_DEPLOYED_SUCCESS}`, () => {})
})
