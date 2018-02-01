import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { CREATED, FINISH_STAGING, START_PUBLIC_FUNDING } = types
const { ADD_TICKET, ADD_DISTRIBUTOR } = types
const { SET_TICKET_QUANTITY } = types
const {
	BUY_TICKET_FROM_PROMOTER,
	BUY_TICKET_FROM_DISTRIBUTOR,
	WITHDRAW
} = types
const byIdObj = {
	[CREATED]: (state, { payload: { project } }) => ({
		...state,
		[project.address]: {
			state: 'Staging',
			tickets: [],
			distributors: [],
			ticketHolders: [],
			purchasesFromPromoter: [],
			purchasesFromDistributor: [],
			...project
		}
	}),
	[FINISH_STAGING]: (state, { payload: { project } }) => ({
		...state,
		[project.address]: { ...state[project.address], state: 'Private Funding' }
	}),
	[START_PUBLIC_FUNDING]: (state, { payload: { project } }) => ({
		...state,
		[project.address]: { ...state[project.address], state: 'Public Funding' }
	}),
	[ADD_TICKET]: (state, { payload: { project, ticket: ticketToAdd } }) => {
		const prevProject = state[project.address]
		const prevTickets = prevProject.tickets
		const nextTicket = [...prevTickets, ticketToAdd.id]
		const projectToAdd = { ...prevProject, tickets: nextTicket }
		return { ...state, [project.address]: projectToAdd }
	},
	[SET_TICKET_QUANTITY]: (state, { payload: { ticket } }) => {
		const projectAddress = ticket.id.split('_')[1] // [0] => type of ticket [1] => project address
		const projectToChange = state[projectAddress]
		//convert to number then back to string
		const newTicketsLeft =
			parseInt(projectToChange.ticketsLeft, 10) - parseInt(ticket.quantity, 10)
		projectToChange.ticketsLeft = newTicketsLeft.toString()
		return { ...state, [projectAddress]: projectToChange }
	},
	[ADD_DISTRIBUTOR]: (
		state,
		{ payload: { project, distributor: distributorToAdd } }
	) => {
		const prevProject = state[project.address]
		const prevDistributors = prevProject.distributors
		const nextDistributors = [...prevDistributors, distributorToAdd.id]
		const projectToAdd = { ...prevProject, distributors: nextDistributors }
		return { ...state, [project.address]: projectToAdd }
	},
	[BUY_TICKET_FROM_PROMOTER]: (
		state,
		{
			payload: {
				project,
			purchaseData: { to, typeOfTicket, quantity, weiSent }
			}
		}
	) => {
		const prevProject = state[project.address]
		const prevPurchases = prevProject.purchasesFromPromoter
		const prevTicketHolders = prevProject.ticketHolders
		const nextPurchases = [
			...prevPurchases,
			{ to, typeOfTicket, quantity, weiSent }
		]
		const nextTicketHolders = prevTicketHolders.includes(to) ? prevTicketHolders : [...prevTicketHolders, to]
		const projectToAdd = {
			...prevProject,
			purchasesFromPromoter: nextPurchases,
			ticketHolders: nextTicketHolders
		}
		return { ...state, [project.address]: projectToAdd }
	},

	[BUY_TICKET_FROM_DISTRIBUTOR]: (
		state,
		{
			payload: {
				project,
			purchaseData: { from, to, typeOfTicket, quantity, weiSent }
			}
		}
	) => {
		const prevProject = state[project.address]
		const prevPurchases = prevProject.purchasesFromDistributor
		const prevTicketHolders = prevProject.ticketHolders
		const nextPurchases = [
			...prevPurchases,
			{ from, to, typeOfTicket, quantity, weiSent }
		]
		const nextTicketHolders = prevTicketHolders.includes(to) ? prevTicketHolders : [...prevTicketHolders, to]
		const projectToAdd = {
			...prevProject,
			purchasesFromDistributor: nextPurchases,
			ticketHolders: nextTicketHolders
		}
		return { ...state, [project.address]: projectToAdd }
	},

	[WITHDRAW]: (state) => {
		return { ...state }
	}
}

const idsObj = {
	[CREATED]: (state, { payload: { project } }) =>
		makeNewSet(state, [project.address])
}

const byId = createReducerFromObj(byIdObj, {})
const ids = createReducerFromObj(idsObj, [])

export default combineReducers({ ids, byId })
