/* eslint-env jest */
import reducer from './project-reducer'
import types from '../actions/action-types'

describe('project-reducer', () => {
	it('should return the intial state', () => {
		expect(reducer(undefined, {})).toEqual({
			byId: {},
			ids: []
		})
	})
	const state = {
		byId: {
			'0XPROJECTADDR0': {
				state: 'Staging',
				projectName: 'TESTPROJECT0',
				totalTickets: '100',
				ticketsLeft: '100',
				consumerMaxTickets: '2',
				promoterAddress: '0XPROMOTERADDR0',
				address: '0XPROJECTADDR0',
				tickets: [],
				distributors: ['0XDISTRIBUTOR0']
			}
		},
		ids: ['0XPROJECTADDR0']
	}
	const project = {
		projectName: 'TESTPROJECT0',
		totalTickets: '100',
		ticketsLeft: '100',
		consumerMaxTickets: '2',
		promoterAddress: '0XPROMOTERADDR0',
		address: '0XPROJECTADDR0',
		state: 'Staging',
		tickets: [],
		distributors: ['0XDISTRIBUTOR0']
	}
	it(`should handle ${types.CREATED}`, () => {
		expect(
			reducer(state, {
				type: types.CREATED,
				payload: { project }
			}).toString()
		).toEqual(state.toString())
	})
	it(`should handle ${types.FINISH_STAGING}`, () => {
		expect(
			reducer(state, { type: types.FINISH_STAGING, payload: { project } })
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJECTADDR0': {
					...state.byId['0XPROJECTADDR0'],
					state: 'Private Funding'
				}
			}
		})
	})
	it(`should handle ${types.START_PUBLIC_FUNDING}`, () => {
		expect(
			reducer(state, { type: types.START_PUBLIC_FUNDING, payload: { project } })
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJECTADDR0': {
					...state.byId['0XPROJECTADDR0'],
					state: 'Public Funding'
				}
			}
		})
	})
	it(`should handle ${types.ADD_TICKET}`, () => {
		expect(
			reducer(
				{
					...state,
					byId: {
						...state.byId,
						'0XPROJECTADDR0': {
							...state.byId['0XPROJECTADDR0'],
							tickets: ['TICKET0', 'TICKET1']
						}
					}
				},
				{
					type: types.ADD_TICKET,
					payload: { project, ticket: { id: 'TICKET2' } }
				}
			)
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJECTADDR0': {
					...state.byId['0XPROJECTADDR0'],
					tickets: ['TICKET0', 'TICKET1', 'TICKET2']
				}
			}
		})
	})
	it(`should handle ${types.SET_TICKET_QUANTITY}`, () => {
		expect(
			reducer(
				{ ...state },
				{
					type: types.SET_TICKET_QUANTITY,
					payload: {
						project,
						ticket: { id: 'TICKET0_0XPROJECTADDR0', quantity: '5' }
					}
				}
			)
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJECTADDR0': { ...state.byId['0XPROJECTADDR0'], ticketsLeft: '95' }
			}
		})
	})
	it(`should handle ${types.ADD_DISTRIBUTOR}`, () => {
		expect(
			reducer(
				{
					...state,
					byId: {
						...state.byId,
						'0XPROJECTADDR0': {
							...state.byId['0XPROJECTADDR0'],
							distributors: [
								...state.byId['0XPROJECTADDR0'].distributors,
								'0XDISTRIBUTOR1',
								'0XDISTRIBUTOR2'
							]
						}
					}
				},
				{
					type: types.ADD_DISTRIBUTOR,
					payload: { distributor: { id: '0XDISTRIBUTOR3' }, project }
				}
			)
		).toEqual({
			...state,
			byId: {
				...state.byId,
				'0XPROJECTADDR0': {
					...state.byId['0XPROJECTADDR0'],
					distributors: [
						...state.byId['0XPROJECTADDR0'].distributors,
						'0XDISTRIBUTOR1',
						'0XDISTRIBUTOR2',
						'0XDISTRIBUTOR3'
					]
				}
			}
		})
	})

	/*
	{
        type: 'ADD_DISTRIBUTOR',
        payload: {
            project: {
                address: '0xb33c6ca1c67a447b4dee7d813e9a4289fb2873de'
            },
            distributor: '0x09032155a8be5999a33e426ccc386066dd201d4a'
        }
    }

	{
		type: "GIVE_ALLOWANCE",
		payload: {
			project: {
				address: "0xb33c6ca1c67a447b4dee7d813e9a4289fb2873de"
			},
			distributor: '0x09032155a8be5999a33e426ccc386066dd201d4a',
			ticket: {
				id: "General_0xb33c6ca1c67a447b4dee7d813e9a4289fb2873de",
				allowance: 100
			}
		}
	}

	{
		type: "TICKET_LISTED",
		payload: {
			project: {
				address: "0xb33c6ca1c67a447b4dee7d813e9a4289fb2873de"
			},
			listingData: {
				owner:"0x937d7f7e89ee138f426beea064cc6d75a3a4b771",
				ticketType:"General",
				amount: "500",
				price: 50
			}
		}
	}

	{
		type: "BUY_TICKET",
		payload: {
			project: {
				address: "0xb33c6ca1c67a447b4dee7d813e9a4289fb2873de"
			},
			tradeData: {
				buyer: "0xe9a56a337641854342c6bb4d47c9cdb6de407cff",
				seller: "0x937d7f7e89ee138f426beea064cc6d75a3a4b771",
				ticketType: "General",
				quantity: 4
			}
		}
	}
	*/
})
