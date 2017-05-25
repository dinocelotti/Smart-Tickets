import * as types from "./../actions/action-types";

const initialState = {
  accounts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ACCOUNTS_SUCCESS:
      return Object.assign({}, state, {
        accounts: action.accounts
      });
    default:
  }
  return state;
};
