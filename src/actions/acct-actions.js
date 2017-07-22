import types from './action-types'
import api from '../api/acct-api'

export const getAccts = () => async dispatch =>
	api.getAcctsAndBals().then(accts =>
		dispatch({
			type: types.GET_ACCTS_SUCCESS,
			payload: accts
		})
	)

export default { getAccts }
