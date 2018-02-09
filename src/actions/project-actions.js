import types from './action-types'
import Web3 from 'web3'
export default {
	projectResolverDeploySuccess,
	Created,
	FinishStaging,
	AddTicket,
	AddDistributor,
	GiveAllowance,
	TicketListed,
	TicketReserved,
	BuyTicket,
	ClaimReserved,
	Withdraw
}
const web3 = new Web3();
function projectResolverDeploySuccess(projectResolverDeployed) {
	return {
		type: types.PROJECT_RESOLVER_DEPLOYED_SUCCESS,
		projectResolverDeployed
	}
}
function Created({ data, address }) {
	return { type: types.CREATED, 
		payload: { 
			project: { ...data, address },
			promoter: data.promoter,
			consumerMax: data.consumerMaxTickets
		} 
	}
}
function FinishStaging(project) {
	return { type: types.FINISH_STAGING, payload: { project } }
}
function AddTicket({ data, address }) {
	// Ticket types are stored on chain as hex, convert back to UTF8 before updating state
	data.ticketType = web3.toUtf8(data.ticketType);
	return {
		type: types.ADD_TICKET,
		payload: {
			project: { address },
			ticket: { ...data }
		}
	}
}
function AddDistributor({ data, address }) {
	return {
		type: types.ADD_DISTRIBUTOR,
		payload: {
			project: { address },
			distributor: data.distributor
		}
	}
}
function GiveAllowance({ data, address }) {
	data.ticketType = web3.toUtf8(data.ticketType);
	return {
		type: types.GIVE_ALLOWANCE,
		payload: {
			project: { address },
			distributor: data.distributor,
			ticket: {
				ticketType: data.ticketType,
				allowance: data.allowance
			}
		}
	}
}
function TicketListed({ data, address }) {
	data.ticketType = web3.toUtf8(data.ticketType);

	const { owner, ticketType, amountPrice } = data
	return {
		type: types.TICKET_LISTED,
		payload: {
			project: {address},
			listingData: {
				owner,
				ticketType,
				amount: amountPrice[0],
				price: amountPrice[1]
			}
		}
	}
}
function TicketReserved({ data, address }) {
	data.ticketType = web3.toUtf8(data.ticketType);

	const { owner, entitled, ticketType, amountPrice } = data
	return {
		type: types.TICKET_RESERVED,
		payload: {
			project: {address},
			reserveData: {
				owner,
				entitled,
				ticketType,
				amount: amountPrice[0],
				price: amountPrice[1]
			}
		}
	}
}
function BuyTicket({ data, address }) {
	data.ticketType = web3.toUtf8(data.ticketType);
	
	const { buyer, seller, ticketType, quantity } = data
	return {
		type: types.BUY_TICKET,
		payload: {
			project: {address},
			tradeData: {
				buyer,
				seller,
				ticketType,
				quantity
			}
		}
	}
}
function ClaimReserved({ data, address }) {
	data.ticketType = web3.toUtf8(data.ticketType);

	const { buyer, seller, ticketType, quantity } = data
	return {
		type: types.CLAIM_RESERVED,
		payload: {
			project: {address},
			tradeData: {
				buyer,
				seller,
				ticketType,
				quantity
			}
		}
	}
}
function Withdraw(event) {
	return { type: types.WITHDRAW, event }
}
