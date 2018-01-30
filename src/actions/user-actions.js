/*
 * action types
 */

export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'

/*
 * action creators
 */

export function setUserAddress(address) {
  return { type: SET_USER_ADDRESS, address }
}