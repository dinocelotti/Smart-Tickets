import Web3 from 'web3'
const web3 = new Web3()
function makeMethod(methodName, ...params) {
	const checkTxObjIncluded = params[params.length - 1]
	if (typeof checkTxObjIncluded === 'object' && checkTxObjIncluded !== null) {
		const txObj = params.pop()
		console.log(
			`makeMethod: ${methodName} ${params} ${JSON.stringify(txObj, null, 1)}`
		)
		return {
			methodName,
			params,
			txObj
		}
	}
	console.log(`makeMethod: ${methodName} ${params} `)
	return {
		methodName,
		params
	}
}
export function encodeString(str) {
	return web3.toHex(str)
}
export function decodeString(hex) {
	return web3.toAscii(hex)
}
export const EntityTypes = {
	queryBuyer: (_buyer, _typeOfTicket) =>
		makeMethod('queryBuyer', _buyer, encodeString(_typeOfTicket)),

	ticketsLeft: () => makeMethod('ticketsLeft'),

	getTicketVals: _typeOfTicket =>
		makeMethod('getTicketVals', encodeString(_typeOfTicket))
}
export const PromoterTypes = {
	finishStaging: () => makeMethod('finishStaging'),

	startPublicFunding: () => makeMethod('startPublicFunding'),

	addTicket: (_typeOfTicket, _priceInWei, _quantity) =>
		makeMethod(
			'addTicket',
			encodeString(_typeOfTicket),
			_priceInWei,
			_quantity
		),

	addIpfsDetailsToTicket: (_typeOfTicket, _hash) =>
		makeMethod('addIpfsDetailsToTicket', encodeString(_typeOfTicket), _hash),

	setTicketPrice: (_typeOfTicket, _priceInWei) =>
		makeMethod('setTicketPrice', encodeString(_typeOfTicket), _priceInWei),

	setTicketQuantity: (_typeOfTicket, _quantity) =>
		makeMethod('setTicketQuantity', encodeString(_typeOfTicket), _quantity),

	addDistributor: _distributor => makeMethod('addDistributor', _distributor),

	setDistributorAllottedQuantity: (_distributor, _typeOfTicket, _quantity) =>
		makeMethod(
			'setDistributorAllottedQuantity',
			_distributor,
			encodeString(_typeOfTicket),
			_quantity
		),

	setDistributorFee: (_distributor, _promotersFee) =>
		makeMethod('setDistributorFee', _distributor, _promotersFee)
}
export const BuyerTypes = {
	setMarkup: (_markup, _typeOfTicket) =>
		makeMethod('setMarkup', _markup, encodeString(_typeOfTicket)),

	buyTicketFromPromoter: (_typeOfTicket, _quantity, txObj) =>
		makeMethod('buyTicketFromPromoter', encodeString(_typeOfTicket), _quantity, txObj),

	buyTicketFromDistributor: (_distributor, _typeOfTicket, _quantity, txObj) =>
		makeMethod(
			'buyTicketFromDistributor',
			_distributor,
			encodeString(_typeOfTicket),
			_quantity,
			txObj
		)
}
