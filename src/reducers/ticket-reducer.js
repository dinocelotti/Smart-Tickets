import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'

const { ADD_TICKET, ADD_IPFS_DETAILS_TO_TICKET } = types
const { SET_TICKET_PRICE, SET_TICKET_QUANTITY } = types

const ticketSetHelper = ({ attr, ticketAttr }) => ({ state, ticket }) => {
	const prevTicket = state[ticket.id]
	const nextTicket = { ...prevTicket, [attr]: ticket[ticketAttr] }
	return { ...state, [ticket.id]: nextTicket }
}

const byIdObj = {
	[ADD_TICKET]: (state, { payload: { ticket } }) => ({
		...state,
		[ticket.id]: ticket
	}),
	[ADD_IPFS_DETAILS_TO_TICKET]: (state, { payload: { ticket } }) => {
		const addIpfs = ticketSetHelper({
			attr: 'ipfsHash',
			ticketAttr: 'ipfsHash'
		})
		return addIpfs({ state, ticket })
	},
	[SET_TICKET_PRICE]: (state, { payload: { ticket } }) => {
		const setTicketPrice = ticketSetHelper({
			attr: 'price',
			ticketAttr: 'priceInWei'
		})
		return setTicketPrice({ state, ticket })
	},
	[SET_TICKET_QUANTITY]: (state, { payload: { ticket } }) => {
		const setTicketQuantity = ticketSetHelper({
			attr: 'quantity',
			ticketAttr: 'quantity'
		})
		return setTicketQuantity({ state, ticket })
	}
}

const idsObj = {
	[ADD_TICKET]: (state, { payload: { ticket } }) =>
		makeNewSet(state, [ticket.id])
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])

export default combineReducers({ byId, ids })
