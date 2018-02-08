
const initialState = {};
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
const projectReducer = (state = initialState, action) => {
    const payload = action.payload;
    switch(action.type) {
        case 'CREATED' :
            return Object.assign({}, state, {
				[payload.project.address]:{
                    state: 'Staging',
                    tickets: [],
                    distributors: [],
                    ticketHolders: [],
                    purchasesFromPromoter: [],
                    purchasesFromDistributor: [],
                    ...action.payload.project,
                }
            });
        case 'ADD_TICKET' :
            const previousProject = state[payload.project.address]
            const ticketList = {...previousProject.tickets, [payload.ticket.id]: payload.ticket}
            return Object.assign({}, state, {
                [payload.project.address]: {...previousProject, tickets: ticketList}
            });
        default : 
            return state;
    }
}
export default projectReducer