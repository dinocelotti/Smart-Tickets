import store from '../store';
import { getAccountsAndBalances, getAccountsAsync } from './account-api';
import {
	loadEventsSuccess,
	getMapAccountsToEventsSuccess,
	eventResolverDeploySuccess
} from './../actions/event-actions';
import utils from './api-helpers';
import ApiErrs from './api-errors';
import { BuyerTypes, EntityTypes, PromoterTypes } from './event-types';

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
		'10',
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
		state: await getState(event),
		promoterAddr: await event.promoter.call(),
		eventAddr: event.address
	};
	return obj;
}
export async function getState(event) {
	const stateMap = {
		0: 'Staging',
		1: 'AwaitingApproval',
		2: 'PrivateFunding',
		3: 'PublicFunding',
		4: 'Done'
	};

	const state = await event.currentState();
	return stateMap[state];
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
		return 'promoter';
	} else if (await isApprovedBuyer(from, event)) {
		return 'approvedBuyer';
	} else {
		return 'endConsumer';
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

class Entity {
	constructor(addr, eventAddr) {
		this.addr = addr;
		this.eventAddr = eventAddr;
		this.eventInstance = {};
	}
	async init() {
		this.eventInstance = await makeEvent(this.eventAddr);
		return this.eventInstance;
	}

	/**************************
   Conversion functions
   **************************/

	async wrapTx({ methodName, params }) {
		if (params.length === 0) {
			return await this.eventInstance[methodName]({
				from: this.addr
			});
		} else {
			return await this.eventInstance[methodName](...params, {
				from: this.addr
			});
		}
	}

	/**************************
   BlockChain query functions
   **************************/

	async queryBuyer({ buyerAddr, ticketType }) {
		const res = await this.wrapTx(
			EntityTypes.queryBuyer(buyerAddr, ticketType)
		);

		return utils.maptoBN(res);
	}
	async getNumOfTicketsLeft() {
		const res = await this.wrapTx(EntityTypes.ticketsLeft());
		//convert to number string
		return utils.BNtoStr(res);
	}

	async getTicketDetails(ticketType) {
		const res = utils.maptoBN(
			await this.wrapTx(EntityTypes.getTicketDetails(ticketType))
		);

		return {
			ticketType: res[0],
			ticketPrice: res[1],
			ticketQuantity: res[2]
		};
	}
}
export class Promoter extends Entity {
	/**************************
     Phase Setters
     **************************/
	async finishStaging() {
		return await this.wrapTx(PromoterTypes.finishStaging());
	}

	async startPublicFunding() {
		return await this.wrapTx(PromoterTypes.startPublicFunding());
	}

	/**************************
     Staging Phase 
     **************************/

	/***************
     Tickets 
     ***************/
	async setTicketPrice(ticketType, ticketPrice) {
		return await this.wrapTx(
			PromoterTypes.setTicketPrice(ticketType, ticketPrice)
		);
	}
	async setTicketQuantity(ticketType, ticketQuantity) {
		return await this.wrapTx(
			PromoterTypes.setTicketQuantity(ticketType, ticketQuantity)
		);
	}
	async handleTicketForm({ ticketType, ticketPrice, ticketQuantity }) {
		return await Promise.all([
			this.setTicketPrice(ticketType, ticketPrice),
			this.setTicketQuantity(ticketType, ticketQuantity)
		]);
	}
	/***************
     Approved Buyers 
     ***************/
	async approveBuyer(buyer) {
		await this.wrapTx(PromoterTypes.approveBuyer(buyer));
	}
	async setBuyerAllottedQuantities(buyer, ticketType, quantity) {
		await this.wrapTx(
			PromoterTypes.setBuyerAllottedQuantities(buyer, ticketType, quantity)
		);
	}
	async setApprovedBuyerFee(buyer, promotersFee) {
		await this.wrapTx(PromoterTypes.setApprovedBuyerFee(buyer, promotersFee));
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

export class Buyer extends Entity {
	constructor(buyerAddr, eventAddr, isApproved = false) {
		super(buyerAddr, eventAddr);
		this.isApproved = isApproved;
	}

	/**************************
     Staging Phase 
     **************************/
	async setMarkup(markupPercent, ticketType) {
		return this.isApproved
			? await this.wrapTx(BuyerTypes.setMarkup(markupPercent, ticketType))
			: ApiErrs.UNAPRVED_BUYER;
	}

	/**************************
     Funding Phase 
     **************************/
	async purchaseTicketFromPromoter(ticketType, quantity) {
		//get phase to check to see if its valid
		return await this.wrapTx(
			BuyerTypes.purchaseTicketFromPromoter(ticketType, quantity)
		);
	}

	async purchaseTicketFromApprovedSeller(
		approvedSellerAddr,
		ticketType,
		quantity
	) {
		return await this.wrapTx(
			BuyerTypes.purchaseTicketFromApprovedSeller(
				approvedSellerAddr,
				ticketType,
				quantity
			)
		);
	}
}
