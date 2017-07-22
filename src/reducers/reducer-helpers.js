export const createReducerFromObj = (obj, initialState) => (
	state = initialState,
	action
) => (obj[action.type] ? obj[action.type](state, action) : state)
