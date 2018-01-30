import types from '../actions/action-types'

const initialState = {
    userAddress: ''
};
/**
 * uiReducer - job of this reducer is to handle front-end state
 * @param {*} state 
 * @param {*} action 
 */
function uiReducer(state = initialState, action) {
    switch(types.type) {
        case 'SET_USER_ADDRESS' : { 
            return Object.assign({}, state, {
                userAddress : action.address
            });
        }
        default : return state;
    }
}
export default uiReducer()
