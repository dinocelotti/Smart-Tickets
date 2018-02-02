import Web3 from 'web3';
const web3 = new Web3();
function makeMethod(methodName, ...params) {
  const checkTxObjIncluded = params[params.length - 1];
  if (typeof checkTxObjIncluded === 'object' && checkTxObjIncluded !== null) {
    const txObj = params.pop();
    console.log(
      `makeMethod: ${methodName} ${params} ${JSON.stringify(txObj, null, 1)}`
    );
    return {
      methodName,
      params,
      txObj
    };
  }
  console.log(`makeMethod: ${methodName} ${params} `);
  return {
    methodName,
    params
  };
}
export function encodeString(str) {
  var myHex = web3.toHex(str);
  console.log('Encoded '+str+' as hex: '+myHex);
  return myHex;
}
export function decodeString(hex) {
  return web3.toUTF8(hex);
}
export const EntityTypes = {
  queryUser: (_buyer, _typeOfTicket) =>
    makeMethod('queryUser', _buyer, encodeString(_typeOfTicket)),

  getTicketVals: _typeOfTicket =>
    makeMethod('getTicketVals', encodeString(_typeOfTicket)),

  listTicket: (ticketType, amountPrice) =>
    makeMethod(
        'listTicket',
        encodeString(ticketType),
        amountPrice
    ),

  cancelListing: ticketType =>
    makeMethod('cancelListing', encodeString(ticketType)),

  reserveTicket: (entitled, ticketType, amountPrice) =>
    makeMethod(
      'reserveTicket',
      entitled,
      ticketType,
      amountPrice
    ),

  cancelReservation: (entitled, ticketType) =>
    makeMethod('cancelReservation', entitled, encodeString(ticketType)),

  buyTicket: (seller, ticketType, quantity) =>
    makeMethod(
      'buyTicket',
      seller,
      encodeString(ticketType),
      quantity
    ),

  claimReserved: (seller, ticketType, quantity) =>
    makeMethod(
      'claimReserved',
      seller,
      ticketType,
      quantity
    )
};
export const PromoterTypes = {
  finishStaging: () => makeMethod('finishStaging'),

  addTicket: (_typeOfTicket, _faceValue, _maxPrice, _quantity) =>
    makeMethod(
      'addTicket',
      encodeString(_typeOfTicket),
      _faceValue,
      _maxPrice,
      _quantity
    ),

  addDistributor: _distributor => makeMethod('addDistributor', _distributor),

  giveAllowance: (_distributor, _typeOfTicket, _quantity) =>
    makeMethod(
      'setDistributorAllottedQuantity',
      _distributor,
      encodeString(_typeOfTicket),
      _quantity
    ),

  setDistributorFee: (_distributor, _promotersFee) =>
    makeMethod('setDistributorFee', _distributor, _promotersFee)
};
export const BuyerTypes = {
  setMarkup: (_markup, _typeOfTicket) =>
    makeMethod('setMarkup', _markup, encodeString(_typeOfTicket)),

  setUserDetails: (_user, _name, _info) =>
    makeMethod('setUserDetails', _user, _name, _info)
};

export const UserTypes = {
  setUser: (userAddresss, name, info) => makeMethod('setUser', name, info),
  getUser: () => makeMethod('getUser', {})
};
