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
	it(`should handle ${types.LOAD_DISTRIBS_SUCCESS}`, () => {
		expect(
			reducer(undefined, {
				type: types.LOAD_DISTRIBS_SUCCESS,
				payload: { distribs: ['0XDISTRIB1', '0XDISTRIB2'], projAddr: '0XPROJADDR1' }
			})
		).toEqual({
			byId: { '0XDISTRIB1': '0XDISTRIB1', '0XDISTRIB2': '0XDISTRIB2' },
			ids: ['0XDISTRIB1', '0XDISTRIB2'],
			tixByDistrib: {}
		})
	})
	it(`should handle ${types.EVENT_PROJ_ADD_DISTRIB}`, () => {
		expect(
			reducer(undefined, {
				type: types.EVENT_PROJ_ADD_DISTRIB,
				payload: { distribId: '0XDISTRIB00', projAddr: '0XPROJADDR1' }
			})
		).toEqual({
			byId: { '0XDISTRIB00': '0XDISTRIB00' },
			ids: ['0XDISTRIB00'],
			tixByDistrib: {}
		})
	})
	it(`should handle ${types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN}`, () => {
		expect(
			reducer(undefined, {
				type: types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN,
				payload: {
					distribId: '0XDISTRIB00',
					tix: {
						id: '0XTIXID',
						allotQuan: '50'
					}
				}
			})
		).toEqual({ byId: {}, ids: [], tixByDistrib: { '0XDISTRIB00': { '0XTIXID': { allotQuan: '50' } } } })
	})
	it(`should handle ${types.EVENT_PROJ_SET_DISTRIB_FEE}`, () => {
		expect(
			reducer(undefined, {
				type: types.EVENT_PROJ_SET_DISTRIB_FEE,
				payload: {
					distribId: '0XDISTRIB00',
					tix: {
						id: '0XTIXID',
						fee: '20'
					}
				}
			})
		).toEqual({ byId: {}, ids: [], tixByDistrib: { '0XDISTRIB00': { '0XTIXID': { fee: '20' } } } })
	})
	it(`should handle ${types.EVENT_PROJ_SET_MARKUP}`, () => {
		expect(
			reducer(undefined, {
				type: types.EVENT_PROJ_SET_MARKUP,
				payload: {
					distribId: '0XDISTRIB00',
					tix: {
						id: '0XTIXID',
						markup: '75'
					}
				}
			})
		).toEqual({ byId: {}, ids: [], tixByDistrib: { '0XDISTRIB00': { '0XTIXID': { markup: '75' } } } })
	})
})
