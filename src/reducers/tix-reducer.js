import * as types from './../actions/action-types'

const initialState = { tixById: {}, tix: [] }

export default (state = initialState, action) => {
	let nextState = { ...state }
	switch (action.type) {
		case types.EVENT_PROJ_LOAD_TIX:
			//empty any existing values
			nextState.tix.length = 0

			//make a map with the key being an address, value being the tix data
			nextState.tixById = action.tix.reduce((prev, t) => {
				//push onto the array for relational lookup later on
				nextState.tix.push(t.id)
				return Object.assign({}, prev, { [t.id]: t })
			}, {})
			return Object.assign({}, state, nextState)

		case types.EVENT_PROJ_ADD_TIX:
			nextState.tixById[action.id] = action.tix
			nextState.tix.push(action.id)
			return nextState

		case types.EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX:
			nextState.tixById[action.id].ipfsHash = action.ipfsHash
			return nextState

		case types.EVENT_PROJ_SET_TIX_PRICE:
			nextState.tixById[action.id].price = action.price
			return nextState

		case types.EVENT_PROJ_SET_TIX_QUANTITY:
			nextState.tixById[action.id].quantity = action.quantity
			return nextState
	}
	return state
}
