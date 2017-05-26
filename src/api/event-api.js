import store from "../store";
import { getAccounts } from "./account-api";
import { createEventSuccess } from "./../actions/event-actions";
const web3RPC = store.getState().web3State.web3RPC;
const event = store.getState().web3State.Event;

export async function createEvent({
  eventName,
  totalTickets,
  consumerMaxTickets,
  promoterAddress
}) {
  //check that the account exists
  const accountAddresses = store
    .getState()
    .accountState.accounts.map(acc => acc.address);
  if (!accountAddresses.includes(promoterAddress)) {
    throw `Address ${promoterAddress} does not exist on this wallet`;
  }
  const newEvent = await event.new(
    eventName,
    "10",
    totalTickets,
    consumerMaxTickets,
    //
    {
      //test address of the promoter for now
      from: promoterAddress,
      gas: 4306940
    }
  );
  console.log(newEvent, newEvent.logs);
  const newEventEntry = {
    eventName,
    totalTickets,
    consumerMaxTickets,
    promoterAddress,
    contractAddress: newEvent.address
  };
  const currentEvents = store.getState().eventState.events;

  store.dispatch(createEventSuccess([newEventEntry, ...currentEvents]));
  getAccounts();
  return newEventEntry;
}
web3RPC.eth.filter("latest", (err, res) => (!err ? console.log(res) : null));
// scan through the accounts the person owns and see if they match an event
export async function pollForEvents(pollTime) {}
export function watchForEvents() {}
function asyncSetTimeout(timeToWaitInMili) {
  return new Promise(resolve => {
    setTimeout(resolve, timeToWaitInMili);
  });
}
export class Promoter {
  /**************************
     Phase Setters
     **************************/
  finishStaging() {}
  startPublicFunding() {}
  /**************************
     Staging Phase 
     **************************/
  //function setTicketPriceAndQuantity(uint8 _typeOfTicket, uint _priceInWei)
  setTicketPrice(ticketType, ticketPrice) {}

  setTicketQuantity(ticketType, quantity) {}
  approveBuyer(buyer) {}
  setBuyerAllottedQuantities(buyer, ticketType, quantity) {}
  setApprovedBuyerFee(buyer, promotersFee) {}
}

export class Buyer {
  /**************************
     Staging Phase 
     **************************/
  setMarkup() {}
  /**************************
     Funding Phase 
     **************************/
  purchaseTicketFromPromoter() {}
  purchaseTicketFromApprovedSeller() {}
}
