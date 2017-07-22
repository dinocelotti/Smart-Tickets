/* eslint-env jest */
import reducer from './distrib-reducer'
import types from '../actions/action-types'

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
				payload: {
					distribs: [{ id: '0XDISTRIB1' }, { id: '0XDISTRIB2' }],
					projAddr: '0XPROJADDR1'
				}
			})
		).toEqual({
			byId: {
				'0XDISTRIB1': { id: '0XDISTRIB1' },
				'0XDISTRIB2': { id: '0XDISTRIB2' }
			},
			ids: ['0XDISTRIB1', '0XDISTRIB2'],
			tixByDistrib: {}
		})
	})
	it(`should handle ${types.ADD_DISTRIB}`, () => {
		expect(
			reducer(undefined, {
				type: types.ADD_DISTRIB,
				payload: { distrib: { id: '0XDISTRIB00' }, projAddr: '0XPROJADDR1' }
			})
		).toEqual({
			byId: { '0XDISTRIB00': { id: '0XDISTRIB00' } },
			ids: ['0XDISTRIB00'],
			tixByDistrib: {}
		})
	})
	it(`should handle ${types.SET_DISTRIB_ALLOT_QUAN}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_DISTRIB_ALLOT_QUAN,
				payload: {
					distrib: { id: '0XDISTRIB00' },
					tix: {
						id: '0XTIXID',
						allotQuan: '50'
					}
				}
			})
		).toEqual({
			byId: {},
			ids: [],
			tixByDistrib: { '0XDISTRIB00': { '0XTIXID': { allotQuan: '50' } } }
		})
	})
	it(`should handle ${types.SET_DISTRIB_FEE}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_DISTRIB_FEE,
				payload: {
					distrib: { id: '0XDISTRIB00', fee: '20' }
				}
			})
		).toEqual({
			byId: {
				'0XDISTRIB00': { fee: '20' }
			},
			tixByDistrib: {},
			ids: []
		})
	})
	it(`should handle ${types.SET_MARKUP}`, () => {
		expect(
			reducer(undefined, {
				type: types.SET_MARKUP,
				payload: {
					distrib: { id: '0XDISTRIB00' },
					tix: {
						id: '0XTIXID',
						markup: '75'
					}
				}
			})
		).toEqual({
			byId: {},
			ids: [],
			tixByDistrib: { '0XDISTRIB00': { '0XTIXID': { markup: '75' } } }
		})
	})
})
