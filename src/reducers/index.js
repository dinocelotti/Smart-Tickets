import { combineReducers } from "redux";
import accountReducer from "./account-reducer";
import promoterReducer from "./promoter-reducer";
import consumerReducer from "./consumer-reducer";
import web3Reducer from "./web3-reducer";
import eventReducer from "./event-reducer";

export default combineReducers({
  accountState: accountReducer,
  promoterState: promoterReducer,
  consumerState: consumerReducer,
  web3State: web3Reducer,
  eventState: eventReducer
});
