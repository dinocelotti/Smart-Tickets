import store from '../store'
import Web3 from 'web3'

export async function getAcctsAndBals() {
	let accs = await getAcctsAsync()
	let balances = (await Promise.all(accs.map(acc => getAcctBalanceAsync(acc)))).map(b => b.toString())

	let l = []
	for (let i = 0; i < accs.length; i++) {
		l.push({
			addr: accs[i],
			balance: balances[i]
		})
	}
	//TODO: store.dispatch(getAcctsSuccess(l))
	return l
}

//wrapper around web3 getAccts
export function getAcctsAsync() {
	const web3 = store.getState().web3State.web3
	return new Promise((resolve, reject) => {
		web3.eth.getAccounts((err, accts) => {
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
	const web3 = store.getState().web3State.web3
	return new Promise((resolve, reject) => {
		web3.eth.getBalance(acct, (err, balance) => {
			if (err) {
				reject(err)
			} else {
				resolve(balance)
			}
		})
	})
}
