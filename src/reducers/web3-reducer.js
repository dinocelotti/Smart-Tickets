import myEvent from "../../build/contracts/Event.json";
import eventResolver from "../../build/contracts/EventResolver.json";
import Web3 from "web3";
const contract = require("truffle-contract");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const Event = contract(myEvent);
const EventResolver = contract(eventResolver);
Event.setProvider(provider);
EventResolver.setProvider(provider);
const web3RPC = new Web3(provider);

const initialState = {
  contract,
  web3RPC,
  Event,
  EventResolver,
  provider
};
export default (state = initialState, action) => state;
