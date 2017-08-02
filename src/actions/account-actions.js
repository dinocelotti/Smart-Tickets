import types from './action-types'
import api from '../api/account-api'

export const getAccounts = () => async dispatch =>
	api.getAccountsAndBals().then(accounts =>
		dispatch({
			type: types.GET_ACCOUNTS_SUCCESS,
			payload: accounts
		})
	)

export default { getAccounts }
