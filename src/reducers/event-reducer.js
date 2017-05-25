import * as types from "./../actions/action-types";
const initialState = {
  events: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_EVENT_SUCCESS:
      return Object.assign({}, state, { events: action.events });
    default:
  }
  return state;
};
