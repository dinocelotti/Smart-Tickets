import types from './../actions/action-types'
import { createReducerFromObj } from './reducer-helpers'
const { WEB3_CONNECTED, PROJECT_RESOLVER_DEPLOYED } = types
const initialState = {
	web3: { connected: false },
	projectResolver: { deployed: false }
}

const web3Obj = {
	[WEB3_CONNECTED]: state => ({ ...state, web3: { connected: true } }),
	[PROJECT_RESOLVER_DEPLOYED]: state => ({
		...state,
		projectResolver: { deployed: true }
	})
}
export default createReducerFromObj(web3Obj, initialState)
