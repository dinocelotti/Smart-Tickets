import { combineReducers } from 'redux'
import acctReducer from './acct-reducer'
import projReducer from './proj-reducer'
import tixReducer from './tix-reducer'
import distribReducer from './distrib-reducer'
export default combineReducers({
	tixState: tixReducer,
	distribState: distribReducer,
	acctState: acctReducer,
	projState: projReducer
})
