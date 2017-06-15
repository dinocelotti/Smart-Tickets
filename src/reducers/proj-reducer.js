import * as types from './../actions/action-types'
const initialState = {
	projResolverDeployed: false,
	projsByAddr: {},
	projs: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		//when we load the projs, replace the existing sprojs
		case types.LOAD_PROJS_SUCCESS:
			let nextState = { projsByAddr: {}, projs: [] }

			//make a map with the key being an address, value being the proj data
			nextState.projsByAddr = action.projs.reduce((prev, proj) => {
				//push onto the array for relational lookup later on
				nextState.projs.push(proj.addr)

				return Object.assign({}, prev, { [proj.addr]: proj })
			}, {})
			console.log('proj-reducer', Object.assign({}, state, nextState))
			//return this new state
			return Object.assign({}, state, nextState)

		case types.PROJ_RESOLVER_DEPLOYED_SUCCESS:
			return Object.assign({}, state, { projResolverDeployed: action.projResolverDeployed })
		default:
	}
	return state
}
