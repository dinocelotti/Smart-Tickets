import BigNumber from 'bignumber.js'

function isBigNumber(object) {
	return (
		object instanceof BigNumber ||
		(object && object.constructor && object.constructor.name === 'BigNumber')
	)
}

/**
 * Takes an event and normalizes the arguments inside it, converting any big numbers into their string equivalents
 * @param {object, string}  
 */
const normalizeArgs = log => {
	const { args, address, ...metadata } = log

	return {
		address,

		data: Object.keys(args).reduce(
			(obj, key) => ({
				...obj,
				//remove any underscores from the argument and check if its a big number
				[key[0] === '_' ? key.slice(1) : key]: isBigNumber(args[key])
					? args[key].toString() //if its a big number then convert it into a string
					: args[key] //else just return the original property
			}),
			{}
		),
		metadata
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
