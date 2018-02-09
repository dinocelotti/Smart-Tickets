const initialState = {};
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
const projectReducer = (state = initialState, action) => {
    const payload = action.payload;
    let previousProject = ''
    let distributorList = ''
    switch(action.type) {
        case 'CREATED' :
            return Object.assign({}, state, {
				[payload.project.address]:{
                    phase: 'Staging',
                    promoter: [payload.promoter],
                    consumerMax: [payload.consumerMax],
                    tickets: {},
                    distributors: {},
                    ticketHolders: {},
                    listings: {},
                    purchasesFromPromoter: [],
                    purchasesFromDistributor: [],
                    ...action.payload.project,
                }
            });

        case 'FINISH_STAGING' :
            previousProject = state[payload.project.address]

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    phase: 'Public'
                }
            });

        case 'ADD_TICKET' : {
            previousProject = state[payload.project.address]
            const ticketList = {
                ...previousProject.tickets, 
                [payload.ticket.ticketType]: payload.ticket
            }

            const newTicketHolders = {
                ...previousProject.ticketHolders,
                promoter: {
                    [payload.ticket.ticketType]: [payload.ticket.quantity]
                }
            }

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject, 
                    tickets: ticketList,
                    ticketHolders: newTicketHolders
                }
            });
        }

        case 'ADD_DISTRIBUTOR' :
            previousProject = state[payload.project.address]
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

        case 'GIVE_ALLOWANCE' :
            previousProject = state[payload.project.address]
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

        case 'TICKET_LISTED' :
            previousProject = state[payload.project.address]

            const newListings = {
                ...previousProject.listings,
                [payload.listingData.ticketType]: {
                    [payload.listingData.owner]: {
                        amount: [payload.listingData.amount],
                        price: [payload.listingData.price]
                    }
                }
            }

            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject, 
                    listings: newListings
                }
            });

        case 'BUY_TICKET' : 
            previousProject = state[payload.project.address]
            let prevBuyerHolding = 0;

            //Check if buyer has an existing balance of this ticketType
            if ([payload.tradeData.buyer][payload.tradeData.ticketType] in previousProject.ticketHolders) {
                prevBuyerHolding = previousProject.ticketHolders[payload.tradeData.buyer][payload.tradeData.ticketType]
            }
            const prevSellerListing = previousProject.listings[payload.tradeData.ticketType][payload.tradeData.seller]

            const newTicketHolders = {
                ...previousProject.ticketHolders,
                [payload.tradeData.buyer]: {
                    [payload.tradeData.ticketType]: prevBuyerHolding + [payload.tradeData.quantity]*1
                }
            }

            const newTicketListings = {
                ...previousProject.listings,
                [payload.tradeData.ticketType]: {
                    [payload.tradeData.seller]: {
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
        

        default : 
            return state;
    }
}
export default projectReducer