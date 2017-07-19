import * as types from './../actions/action-types'

const initialState = {
	web3: { connected: false },
	projResolver: { deployed: false }
}

const actionHandler = {
	[types.WEB3_CONNECTED]: state => ({ ...state, web3: { connected: true } }),
	[types.PROJ_RESOLVER_DEPLOYED]: state => ({
		...state,
		projResolver: { deployed: true }
	})
}
export default (state = initialState, { type }) =>
	actionHandler[type] ? actionHandler[type](state) : state
