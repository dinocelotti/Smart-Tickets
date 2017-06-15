import BigNumber from 'bignumber.js'

function isBigNumber(object) {
    return object instanceof BigNumber || (object && object.constructor && object.constructor.name === 'BigNumber')
}
function maptoBN(arr) {
    return arr.map(x => BNtoStr(x))
}
function BNtoStr(x) {
    return isBigNumber(x) ? x.toString(10) : x
}

export default {
    isBigNumber,
    maptoBN,
    BNtoStr
}
