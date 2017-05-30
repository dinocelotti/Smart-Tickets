import * as types from "./action-types";
export function createEventSuccess(events) {
  return {
    type: types.CREATE_EVENT_SUCCESS,
    events
  };
}
export function loadEventsSuccess(events) {
  console.log(types.LOAD_EVENTS_SUCCESS);
  return {
    type: types.LOAD_EVENTS_SUCCESS,
    events
  };
}

export function getMapAccountsToEventsSuccess(events) {
  return {
    type: types.GET_MAP_ACCOUNTS_TO_EVENTS_SUCCESS,
    events
  };
}
export function eventResolverDeploySuccess(eventResolverDeployed) {
  return {
    type: types.EVENT_RESOLVER_DEPLOYED_SUCCESS,
    eventResolverDeployed
  };
}
