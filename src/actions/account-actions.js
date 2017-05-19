import * as types from "./action-types";

export function getAccountsSuccess(accounts) {
  return {
    type: types.GET_ACCOUNTS_SUCCESS,
    accounts
  };
}
