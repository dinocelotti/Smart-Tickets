import { combineReducers } from 'redux'
import acctReducer from './acct-reducer'
// import consumReducer from './consum-reducer'
import web3Reducer from './web3-reducer'
import projReducer from './proj-reducer'
import tixReducer from './tix-reducer'
import distribReducer from './distrib-reducer'
export default combineReducers({
	tixState: tixReducer,
	distribState: distribReducer,
	acctState: acctReducer,
	// consumState: consumReducer,
	web3State: web3Reducer,
	projState: projReducer,
})
