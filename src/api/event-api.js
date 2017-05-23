import store from "../store";
import Event from "../../build/contracts/Event.json";
import { createEventSuccess } from "./../actions/event-actions";
const web3RPC = store.getState().web3State.web3RPC;
const event = store.getState().web3State.event;

export async function createEvent({
  eventName,
  totalTickets,
  consumerMaxTickets
}) {
  const newEvent = await event.new(
    eventName,
    "10",
    totalTickets,
    consumerMaxTickets,
    {
      //test address of the promoter for now
      from: web3RPC.eth.accounts[0],
      gas: 4306940
    }
  );
  console.log(newEvent);
  const newEventEntry = {
    eventName,
    totalTickets,
    consumerMaxTickets,
    contract: newEvent.address
  };
  const currentEvents = store.getState().eventState.events;
  console.log(newEventEntry);
  store.dispatch(createEventSuccess(currentEvents.push(newEventEntry)));
  return newEventEntry;
}
