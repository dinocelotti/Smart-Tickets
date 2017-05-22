import * as types from "./action-types";
export function createEventSuccess(events) {
  return {
    type: types.CREATE_EVENT_SUCCESS,
    events
  };
}
