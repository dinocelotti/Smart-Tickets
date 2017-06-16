import Web3 from 'web3'
const web3 = new Web3()
function makeMethod(methodName, ...params) {
	return {
		methodName,
		params
	}
}
function encodeString(str) {
	return web3.toHex(str)
}
function decodeString(hex) {
	return web3.toAscii(hex)
}
export const EntityTypes = {
	queryBuyer: (_buyer, _typeOfTix) => makeMethod('queryBuyer', _buyer, encodeString(_typeOfTix)),

	tixsLeft: () => makeMethod('tixsLeft'),

	getTixVals: _typeOfTix => makeMethod('getTixVals', encodeString(_typeOfTix))
}
export const PromoTypes = {
	finishStaging: () => makeMethod('finishStaging'),

	startPublicFunding: () => makeMethod('startPublicFunding'),

	addTix: (_typeOfTix, _priceInWei, _quantity) =>
		makeMethod('addTix', encodeString(_typeOfTix), _priceInWei, _quantity),

	addIpfsDetailsToTix: (_typeOfTix, _hash) => makeMethod('addIpfsDetailsToTix', encodeString(_typeOfTix), _hash),

	setTixPrice: (_typeOfTix, _priceInWei) => makeMethod('setTixPrice', encodeString(_typeOfTix), _priceInWei),

	setTixQuantity: (_typeOfTix, _quantity) => makeMethod('setTixQuantity', encodeString(_typeOfTix), _quantity),

	addistrib: _distrib => makeMethod('addDistrib', _distrib),

	setDistribAllotQuan: (_distrib, _typeOfTix, _quantity) =>
		makeMethod('setDistribAllotQuan', _distrib, encodeString(_typeOfTix), _quantity),

	setDistribFee: (_distrib, _promosFee) => makeMethod('setDistribFee', _distrib, _promosFee)
}
export const BuyerTypes = {
	setMarkup: (_markup, _typeOfTix) => makeMethod('setMarkup', _markup, encodeString(_typeOfTix)),

	buyTixFromPromo: (_typeOfTix, _quantity) => makeMethod('buyTixFromPromo', encodeString(_typeOfTix), _quantity),

	buyTixFromDistrib: (_distrib, _typeOfTix, _quantity) =>
		makeMethod('buyTixFromDistrib', _distrib, encodeString(_typeOfTix), _quantity)
}
