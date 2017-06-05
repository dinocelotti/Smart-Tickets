import * as types from './../actions/action-types';
const initialState = {
	eventResolverDeployed: false,
	events: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case types.LOAD_EVENTS_SUCCESS:
			return Object.assign({}, state, { events: action.events });
		case types.EVENT_RESOLVER_DEPLOYED_SUCCESS:
			return Object.assign({}, state, {
				eventResolverDeployed: action.eventResolverDeployed
			});
		default:
	}
	return state;
};
