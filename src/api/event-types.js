import store from '../store';
import Web3 from 'web3';
const web3 = new Web3();
function makeMethod(methodName, ...params) {
	return {
		methodName,
		params
	};
}
function encodeString(str) {
	return web3.toHex(str);
}
function decodeString(hex) {
	return web3.toAscii(hex);
}
export const EntityTypes = {
	queryBuyer: (_buyer, _typeOfTicket) =>
		makeMethod('queryBuyer', _buyer, encodeString(_typeOfTicket)),

	ticketsLeft: () => makeMethod('ticketsLeft'),

	getTicketDetails: _typeOfTicket =>
		makeMethod('getTicketDetails', encodeString(_typeOfTicket))
};
export const PromoterTypes = {
	finishStaging: () => makeMethod('finishStaging'),

	startPublicFunding: () => makeMethod('startPublicFunding'),

	setTicketPrice: (_typeOfTicket, _priceInWei) =>
		makeMethod('setTicketPrice', encodeString(_typeOfTicket), _priceInWei),

	setTicketQuantity: (_typeOfTicket, _quantity) =>
		makeMethod('setTicketQuantity', encodeString(_typeOfTicket), _quantity),

	approveBuyer: _buyer => makeMethod('approveBuyer', _buyer),

	setBuyerAllottedQuantities: (_buyer, _typeOfTicket, _quantity) =>
		makeMethod(
			'setBuyerAllottedQuantities',
			_buyer,
			encodeString(_typeOfTicket),
			_quantity
		),

	setApprovedBuyerFee: (_buyer, _promotersFee) =>
		makeMethod('setApprovedBuyerFee', _buyer, _promotersFee)
};
export const BuyerTypes = {
	setMarkup: (_markupPercent, _typeOfTicket) =>
		makeMethod('setMarkup', _markupPercent, encodeString(_typeOfTicket)),

	purchaseTicketFromPromoter: (_typeOfTicket, _quantity) =>
		makeMethod(
			'purchaseTicketFromPromoter',
			encodeString(_typeOfTicket),
			_quantity
		),

	purchaseTicketFromApprovedSeller: (
		_approvedSeller,
		_typeOfTicket,
		_quantity
	) =>
		makeMethod(
			'purchaseTicketFromApprovedSeller',
			_approvedSeller,
			encodeString(_typeOfTicket),
			_quantity
		)
};
