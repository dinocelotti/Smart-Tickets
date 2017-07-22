/* eslint-env jest */
import reducer from './proj-reducer'
import types from '../actions/action-types'

describe('proj-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	const state = {
		byId: {
			'0XPROJADDR0': {
				state: 'Setup',
				projName: 'TESTPROJ0',
				totalTix: '100',
				consumMaxTixs: '2',
				promoAddr: '0XPROMOADDR0',
				addr: '0XPROJADDR0',
				tix: [],
				distribs: ['0XDISTRIB0']
			}
		},
		ids: ['0XPROJADDR0']
	}
	const proj = {
		projName: 'TESTPROJ0',
		totalTix: '100',
		consumMaxTixs: '2',
		promoAddr: '0XPROMOADDR0',
		addr: '0XPROJADDR0',
		state: 'Setup',
		tix: [],
		distribs: ['0XDISTRIB0']
	}

	it(`should handle ${types.LOAD_PROJS_SUCCESS}`, () => {
		expect(
			reducer(undefined, {
				type: types.LOAD_PROJS_SUCCESS,
				payload: { projs: [proj] }
			})
		).toEqual(state)
	})
	it(`should handle ${types.CREATED}`, () => {
		expect(
			reducer(state, {
				type: types.CREATED,
				payload: { proj }
			})
		).toEqual(state)
	})
	it(`should handle ${types.FINISH_STAGING}`, () => {
		expect(
			reducer(state, { type: types.FINISH_STAGING, payload: { proj } })
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': {
					...state.byId['0XPROJADDR0'],
					state: 'Private Funding'
				}
			}
		})
	})
	it(`should handle ${types.START_PUBLIC_FUNDING}`, () => {
		expect(
			reducer(state, { type: types.START_PUBLIC_FUNDING, payload: { proj } })
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': { ...state.byId['0XPROJADDR0'], state: 'Public Funding' }
			}
		})
	})
	it(`should handle ${types.LOAD_TIX_SUCCESS}`, () => {
		expect(
			reducer(state, {
				type: types.LOAD_TIX_SUCCESS,
				payload: { proj, tix: ['TIX0', 'TIX1'] }
			})
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': { ...state.byId['0XPROJADDR0'], tix: ['TIX0', 'TIX1'] }
			}
		})
	})
	it(`should handle ${types.ADD_TIX}`, () => {
		expect(
			reducer(
				{
					...state,
					byId: {
						...state.byId,
						'0XPROJADDR0': {
							...state.byId['0XPROJADDR0'],
							tix: ['TIX0', 'TIX1']
						}
					}
				},
				{ type: types.ADD_TIX, payload: { proj, tix: { id: 'TIX2' } } }
			)
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': {
					...state.byId['0XPROJADDR0'],
					tix: ['TIX0', 'TIX1', 'TIX2']
				}
			}
		})
	})
	it(`should handle ${types.LOAD_DISTRIBS_SUCCESS}`, () => {
		expect(
			reducer(state, {
				type: types.LOAD_DISTRIBS_SUCCESS,
				payload: {
					distribs: [{ id: '0XDISTRIB1' }, { id: '0XDISTRIB2' }],
					proj
				}
			})
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': {
					...state.byId['0XPROJADDR0'],
					distribs: [
						...state.byId['0XPROJADDR0'].distribs,
						'0XDISTRIB1',
						'0XDISTRIB2'
					]
				}
			}
		})
	})
	it(`should handle ${types.ADD_DISTRIB}`, () => {
		expect(
			reducer(
				{
					...state,
					byId: {
						...state.byId,
						'0XPROJADDR0': {
							...state.byId['0XPROJADDR0'],
							distribs: [
								...state.byId['0XPROJADDR0'].distribs,
								'0XDISTRIB1',
								'0XDISTRIB2'
							]
						}
					}
				},
				{
					type: types.ADD_DISTRIB,
					payload: { distrib: { id: '0XDISTRIB3' }, proj }
				}
			)
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJADDR0': {
					...state.byId['0XPROJADDR0'],
					distribs: [
						...state.byId['0XPROJADDR0'].distribs,
						'0XDISTRIB1',
						'0XDISTRIB2',
						'0XDISTRIB3'
					]
				}
			}
		})
	})
})
