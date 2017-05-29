import store from "../store";
import { getAccounts } from "./account-api";
import { createEventSuccess } from "./../actions/event-actions";
const { web3RPC, Event, EventResolver } = store.getState().web3;

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
  const newEvent = await Event.new(
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
  const newEventEntry = {
    eventName,
    totalTickets,
    consumerMaxTickets,
    promoterAddress,
    contractAddress: newEvent.address
  };
  const currentEvents = store.getState().eventState.events;
  //assign promoter to event resolver
  await assignAddressToContract(promoterAddress, newEvent.address);
  store.dispatch(createEventSuccess([newEventEntry, ...currentEvents]));
  getAccounts();
  return newEventEntry;
}

async function assignAddressToContract(from, addressToAssign) {
  const result = await EventResolver.assignAddressToContract(addressToAssign, {
    from
  });
  console.log(result);
  return result;
}
async function mapAddressesToEvents(addresses) {
  const numEventsArrPromise = addresses.map(addr =>
    EventResolver.getNumEventsOf.call({ from: addr })
  );
  const numEventsArr = await Promise.all(numEventsArrPromise);
  return addresses.map(async (addr, index) => {
    let eventArrPromise = [];
    for (let i = 0; i < numEventsArr[index]; i++) {
      eventArrPromise.push(
        EventResolver.getEventsAssociated.call(i, { from: addr })
      );
    }
    const eventArr = await Promise.all(eventArrPromise);
    return Promise.all(eventArr.map(eventAddr => makeEvent(eventAddr)));
  });
}
async function addressType(from, event) {
  if (await isPromoter(from, event)) {
    return "promoter";
  } else if (await isApprovedBuyer(from, event)) {
    return "approvedBuyer";
  } else {
    return "endConsumer";
  }
}
async function isPromoter(from, event) {
  const promoterAddress = await event.promoter.call();
  return promoterAddress === from;
}
async function isApprovedBuyer(from, event) {
  const isApproved = await event.isApprovedBuyer.call({ from });
  return isApproved;
}
async function makeEvent(contractAddress) {
  return await Event.at(contractAddress);
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
