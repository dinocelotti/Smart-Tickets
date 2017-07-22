import * as types from './../actions/action-types'
import { createReducerFromObj } from './reducer-helpers'
const { WEB3_CONNECTED, PROJ_RESOLVER_DEPLOYED } = types
const initialState = {
	web3: { connected: false },
	projResolver: { deployed: false }
}

const web3Obj = {
	[WEB3_CONNECTED]: state => ({ ...state, web3: { connected: true } }),
	[PROJ_RESOLVER_DEPLOYED]: state => ({
		...state,
		projResolver: { deployed: true }
	})
}
export default createReducerFromObj(web3Obj, initialState)
