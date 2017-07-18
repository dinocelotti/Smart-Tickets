import { combineReducers } from 'redux'
import acctReducer from './acct-reducer'
import projReducer from './proj-reducer'
import tixReducer from './tix-reducer'
import web3Reducer from './web3-reducer'
import distribReducer from './distrib-reducer'
export default combineReducers({
	web3State: web3Reducer,
	tixState: tixReducer,
	distribState: distribReducer,
	acctState: acctReducer,
	projState: projReducer
})
