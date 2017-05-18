import { combineReducers } from "redux";
import web3Reducer from "./web3-reducer";
import promoterReducer from "./promoter-reducer";
import consumerReducer from "./consumer-reducer";

export default combineReducers({
  web3State: web3Reducer,
  promoterState: promoterReducer,
  consumerState: consumerReducer
});
