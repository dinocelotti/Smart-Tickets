import EthApi from './eth-api'
export async function getAcctsAndBals() {
	console.log('called')
	let accs = await getAcctsAsync()
	let balances = await Promise.all(
		accs.map(a => getAcctBalanceAsync(a).then(b => b.toString()))
	)
	return {
		accts: accs.reduce(
			(arr, addr, currIdx) => [...arr, { addr, balance: balances[currIdx] }],
			[]
		)
	}
}

//wrapper around web3 getAccts
export function getAcctsAsync() {
	return new Promise((resolve, reject) => {
		EthApi.web3.eth.getAccounts((err, accts) => {
			if (err) {
				reject(err)
			} else {
				resolve(accts)
			}
		})
	})
}

//wrapper around web3 getBalance
function getAcctBalanceAsync(acct) {
	return new Promise((resolve, reject) => {
		EthApi.web3.eth.getBalance(acct, (err, balance) => {
			if (err) {
				reject(err)
			} else {
				resolve(balance)
			}
		})
	})
}
