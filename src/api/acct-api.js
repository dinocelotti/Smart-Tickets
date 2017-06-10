import store from '../store';
import { getAcctsSuccess } from './../actions/acct-actions';
const web3RPC = store.getState().web3State.web3RPC;

export async function getAcctsAndBals() {
	let accs = await getAcctsAsync();
	let balances = (await Promise.all(accs.map(acc => getAcctBalanceAsync(acc)))).map(b => b.toString());

	let l = [];
	for (let i = 0; i < accs.length; i++) {
		l.push({
			addr: accs[i],
			ethBalance: balances[i]
		});
	}
	store.dispatch(getAcctsSuccess(l));
	return l;
}

//wrapper around web3 getAccts
export function getAcctsAsync() {
	return new Promise((resolve, reject) => {
		web3RPC.eth.getAccounts((err, accts) => {
			if (err) {
				reject(err);
			} else {
				resolve(accts);
			}
		});
	});
}

//wrapper around web3 getBalance
function getAcctBalanceAsync(acct) {
	return new Promise((resolve, reject) => {
		web3RPC.eth.getBalance(acct, (err, balance) => {
			if (err) {
				reject(err);
			} else {
				resolve(balance);
			}
		});
	});
}
