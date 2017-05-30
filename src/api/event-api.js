import store from "../store";
import { getAccountsAndBalances, getAccountsAsync } from "./account-api";
import {
  createEventSuccess,
  loadEventsSuccess,
  getMapAccountsToEventsSuccess,
  eventResolverDeploySuccess
} from "./../actions/event-actions";
let { web3RPC, Event, EventResolver } = store.getState().web3State;

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

  //add the contract
  await addEventContract(newEvent.address, promoterAddress);
  //assign promoter to event resolver

  await assignAddressToContract(promoterAddress, newEvent.address);
  //store.dispatch(createEventSuccess([newEventEntry, ...currentEvents]));
  getAccountsAndBalances();
  loadEvents();
  return newEventEntry;
}

async function addEventContract(contractAddress, promoterAddress) {
  console.log(contractAddress);
  return await EventResolver.addEventContract(contractAddress, {
    from: promoterAddress
  });
}
async function assignAddressToContract(from, addressToAssign) {
  const result = await EventResolver.assignAddressToContract(addressToAssign, {
    from
  });
  console.log(result);
  return result;
}
export async function deployEventResolver() {
  EventResolver = await EventResolver.deployed();
  store.dispatch(eventResolverDeploySuccess(true));
}
export async function mapAddressesToEvents() {
  const addresses = await getAccountsAsync();
  //map addresses to the number of events they have
  const numEventsArrPromise = addresses.map(addr =>
    EventResolver.getNumEventsOf.call({ from: addr })
  );
  //map addresses to all of the event addresses theyre associated with
  const numEventsArr = await Promise.all(numEventsArrPromise);
  const mappedAtoE = await Promise.all(
    addresses.map(async (addr, index) => {
      let eventArrPromise = [];
      for (let i = 0; i < numEventsArr[index]; i++) {
        eventArrPromise.push(
          EventResolver.getEventsAssociated.call(i, { from: addr })
        );
      }
      //map events to event objects
      const eventArr = await Promise.all(eventArrPromise);
      //console.log("eventArr", eventArr);
      /*
      //map hydrated events to objects we're going to use for display
      let instantiatedEvents = await Promise.all(
        eventArr.map(eventAddr => makeEvent(eventAddr))
      );
      return Promise.all(instantiatedEvents.map(event => mapEventToObj(event)));
      */
      return eventArr;
    })
  );
  store.dispatch(getMapAccountsToEventsSuccess(mappedAtoE));
}

export async function mapEventToObj(event) {
  const obj = {
    eventName: await event.eventName.call(),
    totalTickets: (await event.totalTickets.call()).toString(),
    consumerMaxTickets: (await event.consumerMaxTickets.call()).toString(),
    promoterAddress: await event.promoter.call(),
    contractAddress: event.address
  };
  return obj;
}

export async function loadEvents() {
  const arrLen = parseInt(await EventResolver.getAllEventsLength.call(), 10);

  let eventArrPromise = [];
  for (var i = 0; i < arrLen; i++) {
    eventArrPromise.push(EventResolver.eventContracts(i));
  }
  const eventArrResult = await Promise.all(eventArrPromise);
  const result = await Promise.all(
    eventArrResult.map(eventAddr => makeEvent(eventAddr))
  );

  let mappedResults = await Promise.all(result.map(res => mapEventToObj(res)));
  store.dispatch(loadEventsSuccess(mappedResults));
  mapAddressesToEvents();
  return eventArrResult;
}

export async function addressType(from, event) {
  if (await isPromoter(from, event)) {
    return "promoter";
  } else if (await isApprovedBuyer(from, event)) {
    return "approvedBuyer";
  } else {
    return "endConsumer";
  }
}
async function isPromoter(from, event) {
  const promoterAddress = await event.promoter.call({ from });
  return promoterAddress === from;
}
async function isApprovedBuyer(from, event) {
  const isApproved = await event.isApprovedBuyer.call({ from });
  return isApproved;
}
async function makeEvent(contractAddress) {
  return await Event.at(contractAddress);
}

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
