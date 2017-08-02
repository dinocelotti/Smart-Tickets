import EthApi from './eth-api'
export async function getAccountsAndBals() {
	const accounts = await getAccountsAsync()
	const balances = await Promise.all(
		accounts.map(a => getAccountBalanceAsync(a).then(b => b.toString()))
	)
	return {
		accounts: accounts.reduce(
			(arr, address, currIdx) => [
				...arr,
				{ address, balance: balances[currIdx] }
			],
			[]
		)
	}
}

//wrapper around web3 getAccounts
export function getAccountsAsync() {
	return new Promise((resolve, reject) => {
		EthApi.web3.eth.getAccounts((err, accounts) => {
			if (err) {
				reject(err)
			} else {
				resolve(accounts)
			}
		})
	})
}
export default { getAccountsAndBals, getAccountsAsync }
//wrapper around web3 getBalance
function getAccountBalanceAsync(account) {
	return new Promise((resolve, reject) => {
		EthApi.web3.eth.getBalance(account, (err, balance) => {
			if (err) {
				reject(err)
			} else {
				resolve(balance)
			}
		})
	})
}
