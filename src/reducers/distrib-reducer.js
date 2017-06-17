import * as types from './../actions/action-types'

const initialState = { distribById: {}, distribs: [] }

export default (state = initialState, action) => {
	let nextState = { ...state }
	switch (action.type) {
		case types.LOAD_DISTRIBS_SUCCESS:
			//empty any existing values
			nextState.distribs.length = 0

			//make a map with the key being an address, value being the tix data
			nextState.distribById = action.distribs.reduce((prev, d) => {
				//push onto the array for relational lookup later on
				nextState.distribs.push(d.id)
				return Object.assign({}, prev, { [d.id]: d })
			}, {})
			return Object.assign({}, state, nextState)
		case types.EVENT_PROJ_ADD_DISTRIB:
			nextState.distribById[action.id] = action.distrib
			nextState.tix.push(action.id)
			return nextState
		//TODO: modify this for account for different types of tickets
		case types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN:
			nextState.distribById[action.id].allotQuan = action.allotQuan
			return nextState
		case types.EVENT_PROJ_SET_DISTRIB_FEE:
			nextState.distribById[action.id].fee = action.fee
			return nextState
		case types.EVENT_PROJ_SET_MARKUP:
			nextState.distribById[action.id].markup = action.markup
			return nextState
	}
	return state
}
