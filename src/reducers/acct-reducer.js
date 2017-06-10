import * as types from './../actions/action-types';

const initialState = {
	accts: [],
	assocProjs: []
};
export default (state = initialState, action) => {
	switch (action.type) {
		case types.GET_ACCTS_SUCCESS:
			return Object.assign({}, state, {
				accts: action.accts
			});
		case types.GET_MAP_ACCTS_TO_PROJS_SUCCESS:
			return Object.assign({}, state, { assocProjs: action.projs });
		default:
	}
	return state;
};
