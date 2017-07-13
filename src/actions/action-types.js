//accts
export const GET_ACCTS_SUCCESS = 'GET_ACCTS_SUCCESS'
export const LOAD_PROJS_SUCCESS = 'LOAD_PROJS_SUCCESS'
export const LOAD_TIX_SUCCESS = 'LOAD_TIX_SUCCESS'
export const LOAD_DISTRIBS_SUCCESS = 'LOAD_DISTRIBS_SUCCESS'
export const GET_ASSOC_PROJS_SUCCESS = 'GET_ASSOC_PROJS_SUCCESS'
export const PROJ_RESOLVER_DEPLOYED_SUCCESS = 'PROJ_RESOLVER_DEPLOYED_SUCCESS'

export const CREATED = 'CREATED'
export const FINISH_STAGING = 'FINISH_STAGING'
export const START_PUBLIC_FUNDING = 'START_PUBLIC_FUNDING'

export const ADD_TIX = 'ADD_TIX'
export const ADD_IPFS_DETAILS_TO_TIX = 'ADD_IPFS_DETAILS_TO_TIX'
export const SET_TIX_PRICE = 'SET_TIX_PRICE'
export const SET_TIX_QUANTITY = 'SET_TIX_QUANTITY'

export const ADD_DISTRIB = 'ADD_DISTRIB'
export const SET_DISTRIB_ALLOT_QUAN = 'SET_DISTRIB_ALLOT_QUAN'
export const SET_DISTRIB_FEE = 'EVENT_PRrOJ_SET_DISTRIB_FEE'
export const SET_MARKUP = 'SET_MARKUP'
export const BUY_TIX_FROM_PROMO = 'BUY_TIX_FROM_PROMO'
export const BUY_TIX_FROM_DISTRIB = 'BUY_TIX_FROM_DISTRIB'
export const WITHDRAW = 'WITHDRAW'

export const RESOLVER_ADD_ADDR = 'RESOLVER_ADD_ADDR'
export const RESOLVER_ADD_PROJ = 'RESOLVER_ADD_PROJ'

/**
 * Object - An event object as follows:

address: String, 32 Bytes - address from which this log originated.
args: Object - The arguments coming from the event.
blockHash: String, 32 Bytes - hash of the block where this log was in. null when its pending.
blockNumber: Number - the block number where this log was in. null when its pending.
logIndex: Number - integer of the log index position in the block.
event: String - The event name.
removed: bool - indicate if the transaction this event was created from was removed from the blockchain (due to orphaned block) or never get to it (due to rejected transaction).
transactionIndex: Number - integer of the transactions index position log was created from.
transactionHash: String, 32 Bytes - hash of the transactions this log was created from.

 */
