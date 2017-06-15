import * as types from './action-types'

export function getAcctsSuccess(accts) {
  return {
    type: types.GET_ACCTS_SUCCESS,
    accts
  }
}
