import BigNumber from 'bignumber.js'

function isBigNumber(object) {
	return (
		object instanceof BigNumber ||
		(object && object.constructor && object.constructor.name === 'BigNumber')
	)
}
const normalizeArgs = ({ args, address }) => {
	//logs.args._proj
	return {
		data: Object.keys(args).reduce((obj, key) => {
			return {
				...obj,
				[key[0] === '_' ? key.slice(1) : key]: isBigNumber(args[key])
					? args[key].toString()
					: args[key]
			}
		}, {}),
		addr: address
	}
}

function maptoBN(arr) {
	return arr.map(x => BNtoStr(x))
}
function BNtoStr(x) {
	return isBigNumber(x) ? x.toString(10) : x
}

export default {
	normalizeArgs,
	isBigNumber,
	maptoBN,
	BNtoStr
}
