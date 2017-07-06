//accts
export const GET_ACCTS_SUCCESS = 'GET_ACCTS_SUCCESS'
export const LOAD_PROJS_SUCCESS = 'LOAD_PROJS_SUCCESS'
export const LOAD_TIX_SUCCESS = 'LOAD_TIX_SUCCESS'
export const LOAD_DISTRIBS_SUCCESS = 'LOAD_DISTRIBS_SUCCESS'
export const GET_ASSOC_PROJS_SUCCESS = 'GET_ASSOC_PROJS_SUCCESS'
export const PROJ_RESOLVER_DEPLOYED_SUCCESS = 'PROJ_RESOLVER_DEPLOYED_SUCCESS'

export const EVENT_PROJ_CREATED = 'EVENT_PROJ_CREATED'
export const EVENT_PROJ_FINISH_STAGING = 'EVENT_PROJ_FINISH_STAGING'
export const EVENT_PROJ_START_PUBLIC_FUNDING = 'EVENT_PROJ_START_PUBLIC_FUNDING'

export const EVENT_PROJ_ADD_TIX = 'EVENT_PROJ_ADD_TIX'
export const EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX = 'EVENT_PROJ_ADD_IPFS_DETAILS_TO_TIX'
export const EVENT_PROJ_SET_TIX_PRICE = 'EVENT_PROJ_SET_TIX_PRICE'
export const EVENT_PROJ_SET_TIX_QUANTITY = 'EVENT_PROJ_SET_TIX_QUANTITY'

export const EVENT_PROJ_ADD_DISTRIB = 'EVENT_PROJ_ADD_DISTRIB'
export const EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN = 'EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN'
export const EVENT_PROJ_SET_DISTRIB_FEE = 'EVENT_PRrOJ_SET_DISTRIB_FEE'
export const EVENT_PROJ_SET_MARKUP = 'EVENT_PROJ_SET_MARKUP'
export const EVENT_PROJ_BUY_TIX_FROM_PROMO = 'EVENT_PROJ_BUY_TIX_FROM_PROMO'
export const EVENT_PROJ_BUY_TIX_FROM_DISTRIB = 'EVENT_PROJ_BUY_TIX_FROM_DISTRIB'
export const EVENT_PROJ_WITHDRAW = 'EVENT_PROJ_WITHDRAW'

export const EVENT_PROJ_RESOLVER_ADD_ADDR = 'EVENT_PROJ_RESOLVER_ADD_ADDR'
export const EVENT_PROJ_RESOLVER_ADD_PROJ = 'EVENT_PROJ_RESOLVER_ADD_PROJ'

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
