import store from "../store";
import { getAccountsAndBalances, getAccountsAsync } from "./account-api";
import {
  loadEventsSuccess,
  getMapAccountsToEventsSuccess,
  eventResolverDeploySuccess
} from "./../actions/event-actions";
let { web3RPC, Event, EventResolver } = store.getState().web3State;

export async function createEvent({
  eventName,
  totalTickets,
  consumerMaxTickets,
  promoterAddr
}) {
  //check that the account exists
  const accountAddresses = store
    .getState()
    .accountState.accounts.map(acc => acc.address);
  if (!accountAddresses.includes(promoterAddr)) {
    throw new Error(`Address ${promoterAddr} does not exist on this wallet`);
  }
  const newEvent = await Event.new(
    eventName,
    "10",
    totalTickets,
    consumerMaxTickets,
    {
      //test address of the promoter for now
      from: promoterAddr,
      gas: 4306940
    }
  );

  const newEventEntry = {
    eventName,
    totalTickets,
    consumerMaxTickets,
    promoterAddr,
    eventAddr: newEvent.address
  };

  //add the contract
  await addEventContract(newEvent.address, promoterAddr);
  //assign promoter to event resolver

  await assignAddressToContract(promoterAddr, newEvent.address);
  //store.dispatch(createEventSuccess([newEventEntry, ...currentEvents]));
  getAccountsAndBalances();
  loadEvents();
  return newEventEntry;
}

async function addEventContract(eventAddr, promoterAddr) {
  console.log(eventAddr);
  return await EventResolver.addEventContract(eventAddr, {
    from: promoterAddr
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
    promoterAddr: await event.promoter.call(),
    eventAddr: event.address
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
  const promoterAddr = await event.promoter.call({ from });
  return promoterAddr === from;
}
async function isApprovedBuyer(from, event) {
  const isApproved = await event.isApprovedBuyer.call({ from });
  return isApproved;
}
async function makeEvent(eventAddr) {
  return await Event.at(eventAddr);
}

// scan through the accounts the person owns and see if they match an event
export async function pollForEvents(pollTime) {}

function asyncSetTimeout(timeToWaitInMili) {
  return new Promise(resolve => {
    setTimeout(resolve, timeToWaitInMili);
  });
}

export class Promoter {
  constructor(promoterAddr, eventAddr) {
    this.promoterAddr = promoterAddr;
    this.eventAddr = eventAddr;
    this.eventResolver = EventResolver;
    this.eventInstance = {};
    this.web3 = web3RPC;
  }
  async init() {
    this.eventInstance = await makeEvent(this.eventAddr);
    return this.eventInstance;
  }
  /**************************
   Conversion functions
   **************************/
  encodeString(str) {
    return this.web3.toHex(str);
  }
  decodeString(hex) {
    return this.web3.toAscii(hex);
  }
  async wrapTx(method, ...params) {
    if (params.length === 0) {
      {
        return await this.eventInstance[method]({
          from: this.promoterAddr
        });
      }
    } else {
      return await this.eventInstance[method](...params, {
        from: this.promoterAddr
      });
    }
  }
  /**************************
     Phase Setters
     **************************/
  finishStaging() {}
  startPublicFunding() {}
  /**************************
     Staging Phase 
     **************************/
  //function setTicketPriceAndQuantity(uint8 _typeOfTicket, uint _priceInWei)
  async setTicketPrice(ticketType, ticketPrice) {
    return await this.eventInstance.setTicketPrice(ticketType, ticketPrice, {
      from: this.promoterAddr
    });
  }
  async setTicketQuantity(ticketType, ticketQuantity) {
    await this.wrapTx("setTicketQuantity", ticketType, ticketQuantity);
    return await this.eventInstance.setTicketQuantity(
      ticketType,
      ticketQuantity,
      { from: this.promoterAddr }
    );
  }
  async handleTicketForm({ ticketType, ticketPrice, ticketQuantity }) {
    ticketType = this.encodeString(ticketType);
    return await Promise.all([
      this.setTicketPrice(ticketType, ticketPrice),
      this.setTicketQuantity(ticketType, ticketQuantity)
    ]);
  }

  async getNumOfTicketsLeft() {
    const res = await this.wrapTx("ticketsLeft");

    //convert to number string
    return res.toString(10);
  }
  async getTicketDetails(ticketType) {
    let res = await this.wrapTx(
      "getTicketDetails",
      this.encodeString(ticketType)
    );

    console.log("getTicketDetails", res);
    res = res.map(x => x.toString(10));
    return {
      ticketType: res[0],
      ticketPrice: res[1],
      ticketQuantity: res[2]
    };
  }
  async approveBuyer(buyer) {
    await this.wrapTx("approveBuyer", buyer);
  }
  async setBuyerAllottedQuantities(buyer, ticketType, quantity) {
    await this.wrapTx(
      "setBuyerAllottedQuantities",
      buyer,
      this.encodeString(ticketType),
      quantity
    );
  }
  async setApprovedBuyerFee(buyer, promotersFee) {
    await this.wrapTx("setApprovedBuyerFee", buyer, promotersFee);
  }

  async handleBuyerForm({
    approvedBuyerAddress,
    ticketType,
    buyerAllottedQuantities,
    approvedBuyerFee
  }) {
    let txArr = [];
    txArr.push(this.approveBuyer(approvedBuyerAddress));
    txArr.push(
      this.setBuyerAllottedQuantities(
        approvedBuyerAddress,
        ticketType,
        buyerAllottedQuantities
      )
    );
    txArr.push(
      this.setApprovedBuyerFee(approvedBuyerAddress, approvedBuyerFee)
    );
    return await Promise.all(txArr);
  }
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
