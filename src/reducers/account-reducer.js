import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { GET_ACCOUNTS_SUCCESS } = types
const { BUY_TICKET_FROM_DISTRIBUTOR } = types
const byIdObj = {
	[GET_ACCOUNTS_SUCCESS]: (state, { payload: { accounts } }) => ({
		...state,
		...accounts.reduce((obj, acc) => ({ ...obj, [acc.address]: acc }), {})
	}),
	[BUY_TICKET_FROM_DISTRIBUTOR]: (
		state,
		{
				payload: {
					project,
			purchaseData: { from, to, typeOfTicket, quantity, weiSent }
				}
			}
	) => {
		const ticketTitle = `${typeOfTicket}_${project.address}`
		const prevAccountState = state[to]
		const prevTicketState = prevAccountState.tickets
		const nextTicketState = {
			...prevTicketState,
			[ticketTitle]: { from, to, typeOfTicket, quantity, weiSent }
		}
		const nextAccountState = {
			...prevAccountState,
			tickets: nextTicketState
		}
		return { ...state, [to]: nextAccountState }
	}
}

const idsObj = {
	[GET_ACCOUNTS_SUCCESS]: (state, { payload: { accounts } }) =>
		makeNewSet(state, accounts.map(({ address }) => address))
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])
export default combineReducers({ ids, byId })
