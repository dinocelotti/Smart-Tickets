const initialState = {};
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
const projectReducer = (state = initialState, action) => {
    const payload = action.payload;
    let previousProject = ''
    switch(action.type) {
        case 'CREATED' :
            return Object.assign({}, state, {
				[payload.project.address]:{
                    phase: 'Staging',
                    tickets: [],
                    distributors: [],
                    ticketHolders: [],
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

        case 'ADD_TICKET' :
            previousProject = state[payload.project.address]
            const ticketList = {...previousProject.tickets, [payload.ticket.id]: payload.ticket}
            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject, 
                    tickets: ticketList
                }
            });

        case 'ADD_DISTRIBUTOR' :
            previousProject = state[payload.project.address]
            const distributorList = {
                ...previousProject.distributors, 
                [payload.distributor.address]: payload.distributor}
            return Object.assign({}, state, {
                [payload.project.address]: {
                    ...previousProject,
                    distributors: distributorList
                }
            });
        default : 
            return state;
    }
}
export default projectReducer