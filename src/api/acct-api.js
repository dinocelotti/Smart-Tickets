import store from '../store'
import { getAcctsSuccess } from './../actions/acct-actions'
import Web3 from 'web3'
const web3RPC = new Web3(store.getState().web3State.provider)

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
	store.dispatch(getAcctsSuccess(l))
	return l
}

//wrapper around web3 getAccts
export function getAcctsAsync() {
	return new Promise((resolve, reject) => {
		web3RPC.eth.getAccounts((err, accts) => {
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
		web3RPC.eth.getBalance(acct, (err, balance) => {
			if (err) {
				reject(err)
			} else {
				resolve(balance)
			}
		})
	})
}
