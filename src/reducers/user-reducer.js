const initialState = '';
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
const uiReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_USER_ADDRESS' : 
            return action.address;
        default : 
            return state;
    }
}
export default uiReducer
