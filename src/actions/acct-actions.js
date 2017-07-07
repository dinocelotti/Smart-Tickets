import * as types from './action-types'
import * as api from '../api/acct-api'

export const getAcctsSuccess = () => async dispatch =>
	api.getAcctsAndBals().then(accts =>
		dispatch({
			type: types.GET_ACCTS_SUCCESS,
			payload: accts
		})
	)
