import store from "../store";
import { getAccountsSuccess } from "./../actions/account-actions";
const web3RPC = store.getState().web3State.web3RPC;

export async function getAccountsAndBalances() {
  let accs = await getAccountsAsync();
  let balances = (await Promise.all(
    accs.map(acc => getAccountBalanceAsync(acc))
  )).map(b => b.toString());

  let l = [];
  for (let i = 0; i < accs.length; i++) {
    l.push({
      address: accs[i],
      ethBalance: balances[i]
    });
  }
  store.dispatch(getAccountsSuccess(l));
  return l;
}

//wrapper around web3 getAccounts
export function getAccountsAsync() {
  return new Promise((resolve, reject) => {
    web3RPC.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      } else {
        resolve(accounts);
      }
    });
  });
}

//wrapper around web3 getBalance
function getAccountBalanceAsync(account) {
  return new Promise((resolve, reject) => {
    web3RPC.eth.getBalance(account, (err, balance) => {
      if (err) {
        reject(err);
      } else {
        resolve(balance);
      }
    });
  });
}
