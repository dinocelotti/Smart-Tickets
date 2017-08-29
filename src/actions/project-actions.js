import types from './action-types'
export default {
	projectResolverDeploySuccess,
	Created,
	FinishStaging,
	StartPublicFunding,
	AddTicket,
	AddIpfsDetailsToTicket,
	SetTicketPrice,
	SetTicketQuantity,
	AddDistributor,
	SetDistributorAllottedQuantity,
	SetDistributorFee,
	SetMarkup,
	BuyTicketFromPromoter,
	BuyTicketFromDistributor,
	Withdraw
}
function projectResolverDeploySuccess(projectResolverDeployed) {
	return {
		type: types.PROJECT_RESOLVER_DEPLOYED_SUCCESS,
		projectResolverDeployed
	}
}
const getId = (data, address) =>
	`${data.distributor || data.typeOfTicket}_${address}`

function Created({ data, address }) {
	return { type: types.CREATED, payload: { project: { ...data, address } } }
}
function FinishStaging(project) {
	return { type: types.FINISH_STAGING, payload: { project } }
}
function StartPublicFunding(project) {
	return { type: types.START_PUBLIC_FUNDING, payload: { project } }
}
function AddTicket({ data, address }) {
	return {
		type: types.ADD_TICKET,
		payload: {
			project: { address },
			ticket: { id: getId(data, address), ...data }
		}
	}
}
function AddIpfsDetailsToTicket({ data, address }) {
	return {
		type: types.ADD_IPFS_DETAILS_TO_TICKET,
		payload: {
			project: { address },
			ticket: { id: getId(data, address), ...data }
		}
	}
}
function SetTicketPrice({ data, address }) {
	return {
		type: types.SET_TICKET_PRICE,
		payload: {
			project: { address },
			ticket: { id: getId(data, address), ...data }
		}
	}
}
function SetTicketQuantity({ data, address }) {
	return {
		type: types.SET_TICKET_QUANTITY,
		payload: {
			project: { address },
			ticket: { id: getId(data, address), ...data }
		}
	}
}

function AddDistributor({ data, address }) {
	return {
		type: types.ADD_DISTRIBUTOR,
		payload: {
			project: { address },
			distributor: { id: getId(data, address), ...data }
		}
	}
}
function SetDistributorAllottedQuantity({ data, address }) {
	return {
		type: types.SET_DISTRIBUTOR_ALLOTTED_QUANTITY,
		payload: {
			project: { address },
			distributor: {
				id: getId(data, address),
				...data
			},
			ticket: {
				id: getId({ typeOfTicket: data.typeOfTicket }, address),
				allottedQuantity: data.allottedQuantity
			}
		}
	}
}
//set the promoter fee for a distributor
function SetDistributorFee({ data, address }) {
	return {
		type: types.SET_DISTRIBUTOR_FEE,
		payload: {
			project: { address },
			distributor: { id: getId(data, address), ...data }
		}
	}
}
function SetMarkup({ data, address }) {
	return {
		type: types.SET_MARKUP,
		payload: {
			project: { address },
			distributor: { id: getId(data, address), ...data },
			ticket: {
				id: getId({ typeOfTicket: data.typeOfTicket }, address),
				fee: data.markup
			}
		}
	}
}
function BuyTicketFromPromoter({ data, address }) {
	const { typeOfTicket, quantity, weiSent, from } = data
	return {
		type: types.BUY_TICKET_FROM_PROMOTER,
		payload: {
			project: { address },
			purchaseData: {
				from,
				typeOfTicket,
				quantity,
				weiSent
			}
		}
	}
}
function BuyTicketFromDistributor({ data, address }) {
	const { from, typeOfTicket, quantity, weiSent } = data
	return {
		type: types.BUY_TICKET_FROM_DISTRIBUTOR,
		payload: {
			project: { address },
			purchaseData: {
				from,
				typeOfTicket,
				quantity,
				weiSent
			}
		}
	}
}
function Withdraw(event) {
	return { type: types.WITHDRAW, event }
}
