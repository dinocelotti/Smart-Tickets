import { combineReducers } from 'redux'

import accountReducer from './account-reducer'
import projectReducer from './project-reducer'
import web3Reducer from './web3-reducer'
import userReducer from './user-reducer'

export default combineReducers({
	web3State: web3Reducer,
	accountState: accountReducer,
	projectState: projectReducer,
	userState: userReducer
})
