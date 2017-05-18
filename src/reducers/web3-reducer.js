import myEvent from "../../build/contracts/Event.json";
import SimpleStorage from "../../build/contracts/SimpleStorage.json";

import Web3 from "web3";

const contract = require("truffle-contract");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const event = contract(myEvent);
event.setProvider(provider);
const simpleStorage = contract(SimpleStorage);
simpleStorage.setProvider(provider);
const web3RPC = new Web3(provider);

const initialState = {
  provider,
  simpleStorage,
  web3: web3RPC,
  event
};

export default (state = initialState, action) => state;
