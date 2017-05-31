import * as types from "./../actions/action-types";

const initialState = {
  address: "",
  eventAddr: "",
  eventInstance: {},
  eventResolver: {},
  web3: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_CURRENT_PROMOTER_SUCCESS:
      return Object.assign({}, state, action.currentPromoter);
    default:
  }

  return state;
};
