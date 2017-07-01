/* eslint-env jest */
import reducer from './acct-reducer'
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
	it(`should handle ${types.GET_ASSOC_PROJS_SUCCESS}`, () => {
		let response = {
			type: types.GET_ASSOC_PROJS_SUCCESS,
			payload: {
				assocProjs: [
					{
						assocProjs: ['0x886759a2104C091446d91597F22EBb264F31995F', '0xC27F4E671019eD54fCB82BbC702CAE1347385B4F'],
						acct: '0x86cd5715b19a2a279a5bd5d33590b37b9587954b'
					}
				]
			}
		}
		expect(reducer(undefined, response)).toEqual({
			byId: {
				'0x86cd5715b19a2a279a5bd5d33590b37b9587954b': {
					assocProjs: ['0x886759a2104C091446d91597F22EBb264F31995F', '0xC27F4E671019eD54fCB82BbC702CAE1347385B4F']
				}
			},
			ids: ['0x86cd5715b19a2a279a5bd5d33590b37b9587954b']
		})
	})
})