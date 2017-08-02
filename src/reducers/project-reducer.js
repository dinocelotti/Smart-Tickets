import types from './../actions/action-types'
import { combineReducers } from 'redux'
import { createReducerFromObj, makeNewSet } from './reducer-helpers'
const { CREATED, FINISH_STAGING, START_PUBLIC_FUNDING } = types
const { ADD_TICKET, ADD_DISTRIBUTOR } = types
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
			ticket: [],
			distributors: [],
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
		const prevTicket = prevProject.ticket
		const nextTicket = [...prevTicket, ticketToAdd.id]
		const projectToAdd = { ...prevProject, ticket: nextTicket }
		return { ...state, [project.address]: projectToAdd }
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
	[BUY_TICKET_FROM_PROMOTER]: (state, action) => {
		return { ...state }
	},
	[WITHDRAW]: (state, action) => {
		return { ...state }
	},
	[BUY_TICKET_FROM_DISTRIBUTOR]: (state, action) => {
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
