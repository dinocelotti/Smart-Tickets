import myEvent from "../../build/contracts/Event.json";
import Web3 from "web3";
const contract = require("truffle-contract");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const event = contract(myEvent);
event.setProvider(provider);
const web3RPC = new Web3(provider);

const initialState = {
  contract,
  web3RPC,
  event,
  provider
};
export default (state = initialState, action) => state;
