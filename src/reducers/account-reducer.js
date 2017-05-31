import * as types from "./../actions/action-types";

const initialState = {
  accounts: [],
  associatedEvents: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ACCOUNTS_SUCCESS:
      return Object.assign({}, state, {
        accounts: action.accounts
      });
    case types.GET_MAP_ACCOUNTS_TO_EVENTS_SUCCESS:
      return Object.assign({}, state, { associatedEvents: action.events });
    default:
  }
  return state;
};
