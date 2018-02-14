const initialState = {};
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
const projectReducer = (state = initialState, action) => {
    const payload = action.payload;
    let distributorList = ''
    switch(action.type) {
        case 'CREATED' :
            return Object.assign({}, state, {
				[payload.project.address]:{
                    phase: 'Staging',
                    promoter: payload.promoter,
                    consumerMax: payload.consumerMax,
                    tickets: {},
                    distributors: {},
                    ticketHolders: {},
                    listings: {},
                    purchasesFromPromoter: [],
                    purchasesFromDistributor: [],
                    ...action.payload.project,
                }
            });

        case 'FINISH_STAGING' : {
            const previousProject = state[payload.project.address]

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    phase: 'Public'
                }
            });
        }

        case 'ADD_TICKET' : {
            const ticketType = [payload.ticket.ticketType]
            const previousProject = state[payload.project.address]

            //Add new tickets to this project's state
            let prevQuantity = 0
            if (ticketType in previousProject.tickets) {
                prevQuantity = previousProject.tickets[ticketType].quantity
            }
            const newTicketList = {
                ...previousProject.tickets, 
                [ticketType]: {
                    ...payload.ticket,
                    quantity: prevQuantity + payload.ticket.quantity*1
                }
            }

            //Give new tickets to this promoter
            const promoAddr = previousProject.promoter
            let prevBalance = 0
            if (promoAddr in previousProject.ticketHolders) {
                if (ticketType in previousProject.ticketHolders[promoAddr]) {
                    
                    prevBalance = previousProject.ticketHolders[promoAddr][ticketType]
                }
            }
            const newTicketHolders = {
                ...previousProject.ticketHolders,
                [previousProject.promoter]: {
                    ...previousProject.ticketHolders[promoAddr],
                    [ticketType]: prevBalance + payload.ticket.quantity*1
                }
            }

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject, 
                    tickets: newTicketList,
                    ticketHolders: newTicketHolders
                }
            });
        }

        case 'ADD_DISTRIBUTOR' : {
            const previousProject = state[payload.project.address]
            distributorList = {
                ...previousProject.distributors,
                [payload.distributor]: {}
            }

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    distributors: distributorList
                }
            });
        }

        case 'GIVE_ALLOWANCE' : {
            const previousProject = state[payload.project.address]
            const previousDistributor = previousProject.distributors[payload.distributor]
            distributorList = {
                ...previousProject.distributors,
                [payload.distributor]: {
                    ...previousDistributor,
                    [payload.ticket.ticketType]: [payload.ticket.allowance]
                }
            }

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    distributors: distributorList
                }
            });
        }

        case 'TICKET_LISTED' : {
            const previousProject = state[payload.project.address]
            const ticketType = payload.listingData.ticketType
            const owner = payload.listingData.owner

            //Create new listing
            const newListings = {
                ...previousProject.listings,
                [ticketType]: {
                    [owner]: {
                        amount: [payload.listingData.amount],
                        price: [payload.listingData.price]
                    }
                }
            }

            //Reduce sellers balance
            const prevBalance = previousProject.ticketHolders[owner][ticketType]
            const newTicketHolders = {
                ...previousProject.ticketHolders,
                [owner]: {
                    ...previousProject.ticketHolders[owner],
                    [ticketType]: prevBalance - payload.listingData.amount*1
                }
            } 

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject, 
                    listings: newListings,
                    ticketHolders: newTicketHolders
                }
            });
        }

        case 'BUY_TICKET' : {
            const previousProject = state[payload.project.address]
            const buyer = payload.tradeData.buyer
            const seller = payload.tradeData.seller
            const ticketType = payload.tradeData.ticketType

            //Set buyer's new holdings
            let prevBuyerHolding = 0;
            if (buyer in previousProject.ticketHolders) {
                if (ticketType in previousProject.ticketHolders[buyer]) {
                    prevBuyerHolding = previousProject.ticketHolders[buyer][ticketType]
                }
            }
            const newTicketHolders = {
                ...previousProject.ticketHolders,
                [buyer]: {
                    [ticketType]: prevBuyerHolding + [payload.tradeData.quantity]*1
                }
            }

            //Set sellers new listings
            const prevSellerListing = previousProject.listings[ticketType][seller]
            const newTicketListings = {
                ...previousProject.listings,
                [ticketType]: {
                    [seller]: {
                        ...prevSellerListing,
                        amount: prevSellerListing.amount - [payload.tradeData.quantity]*1,           
                    }
                }
            }         

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    ticketHolders: newTicketHolders,
                    listings: newTicketListings
                }
            });
        }

        default : 
            return state;
    }
}
export default projectReducer