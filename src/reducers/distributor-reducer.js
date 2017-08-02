import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { SET_DISTRIBUTOR_ALLOTTED_QUANTITY, SET_MARKUP } = types
const { SET_DISTRIBUTOR_FEE, ADD_DISTRIBUTOR } = types
const ticketHandler = (state = {}, ticketId, attrName, attrVal) => ({
	...state,
	[ticketId]: { ...state[ticketId], [attrName]: attrVal }
})
const ticketByDistributorObj = {
	[SET_DISTRIBUTOR_ALLOTTED_QUANTITY]: (
		state,
		{ payload: { distributor, ticket } }
	) => ({
		...state,
		[distributor.id]: ticketHandler(
			state[distributor.id],
			ticket.id,
			'allottedQuantity',
			ticket.allottedQuantity
		)
	}),
	[SET_MARKUP]: (state, { payload: { distributor, ticket } }) => ({
		...state,
		[distributor.id]: ticketHandler(
			state[distributor.id],
			ticket.id,
			'markup',
			ticket.markup
		)
	})
}
const byIdObj = {
	[SET_DISTRIBUTOR_FEE]: (state, { payload: { distributor } }) => ({
		...state,
		[distributor.id]: { ...state[distributor.id], fee: distributor.fee }
	}),
	[ADD_DISTRIBUTOR]: (state, { payload: { distributor } }) => ({
		...state,
		[distributor.id]: distributor
	})
}
const idsObj = {
	[ADD_DISTRIBUTOR]: (state, { payload: { distributor } }) =>
		makeNewSet(state, [distributor.id])
}

const ticketByDistributor = createReducerFromObj(ticketByDistributorObj, {})
const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])
export default combineReducers({ ticketByDistributor, byId, ids })
