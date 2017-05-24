import store from "../store";
import Event from "../../build/contracts/Event.json";
import { getAccounts } from "./account-api";
import { createEventSuccess } from "./../actions/event-actions";
const web3RPC = store.getState().web3State.web3RPC;
const event = store.getState().web3State.event;

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
  console.log(newEvent);
  const newEventEntry = {
    eventName,
    totalTickets,
    consumerMaxTickets,
    promoterAddress,
    contractAddress: newEvent.address
  };
  const currentEvents = store.getState().eventState.events;

  let e = [newEventEntry, ...currentEvents];
  console.log(e);
  store.dispatch(createEventSuccess(e));
  getAccounts();
  return newEventEntry;
}

class Promoter {
  /**************************
     Phase Setters
     **************************/
  finishStaging() {}
  startPublicFunding() {}
  /**************************
     Staging Phase 
     **************************/
  //function setTicketPriceAndQuantity(uint8 _typeOfTicket, uint _priceInWei)
  setTicketPrice() {}

  setTicketQuantity() {}
  approveBuyer() {}
  setBuyerAllottedQuantities() {}
  setApprovedBuyerFee() {}
}

class Buyer {
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
