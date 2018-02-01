import { combineReducers } from 'redux'

import accountReducer from './account-reducer'
import projectReducer from './project-reducer'
import ticketReducer from './ticket-reducer'
import web3Reducer from './web3-reducer'
import distributorReducer from './distributor-reducer'
import userReducer from './user-reducer'

export default combineReducers({
	web3State: web3Reducer,
	ticketState: ticketReducer,
	distributorState: distributorReducer,
	accountState: accountReducer,
	projectState: projectReducer,
	userState: userReducer
})
