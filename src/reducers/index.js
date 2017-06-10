import { combineReducers } from 'redux';
import acctReducer from './acct-reducer';
import consumReducer from './consum-reducer';
import web3Reducer from './web3-reducer';
import projReducer from './proj-reducer';

export default combineReducers({
	acctState: acctReducer,
	consumState: consumReducer,
	web3State: web3Reducer,
	projState: projReducer
});
