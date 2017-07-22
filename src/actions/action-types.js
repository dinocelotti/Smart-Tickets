//accts
const GET_ACCTS_SUCCESS = 'GET_ACCTS_SUCCESS'
const LOAD_PROJS_SUCCESS = 'LOAD_PROJS_SUCCESS'
const LOAD_TIX_SUCCESS = 'LOAD_TIX_SUCCESS'
const LOAD_DISTRIBS_SUCCESS = 'LOAD_DISTRIBS_SUCCESS'
const GET_ASSOC_PROJS_SUCCESS = 'GET_ASSOC_PROJS_SUCCESS'

const CREATED = 'CREATED'
const FINISH_STAGING = 'FINISH_STAGING'
const START_PUBLIC_FUNDING = 'START_PUBLIC_FUNDING'

const ADD_TIX = 'ADD_TIX'
const ADD_IPFS_DETAILS_TO_TIX = 'ADD_IPFS_DETAILS_TO_TIX'
const SET_TIX_PRICE = 'SET_TIX_PRICE'
const SET_TIX_QUANTITY = 'SET_TIX_QUANTITY'

const ADD_DISTRIB = 'ADD_DISTRIB'
const SET_DISTRIB_ALLOT_QUAN = 'SET_DISTRIB_ALLOT_QUAN'
const SET_DISTRIB_FEE = 'SET_DISTRIB_FEE'
const SET_MARKUP = 'SET_MARKUP'
const BUY_TIX_FROM_PROMO = 'BUY_TIX_FROM_PROMO'
const BUY_TIX_FROM_DISTRIB = 'BUY_TIX_FROM_DISTRIB'
const WITHDRAW = 'WITHDRAW'

const RESOLVER_ADD_ADDR = 'RESOLVER_ADD_ADDR'
const RESOLVER_ADD_PROJ = 'RESOLVER_ADD_PROJ'

const WEB3_CONNECTED = 'WEB3_CONNECTED'
const PROJ_RESOLVER_DEPLOYED = 'PROJ_RESOLVER_DEPLOYED'

export default {
	GET_ACCTS_SUCCESS,
	LOAD_PROJS_SUCCESS,
	LOAD_TIX_SUCCESS,
	LOAD_DISTRIBS_SUCCESS,
	GET_ASSOC_PROJS_SUCCESS,
	CREATED,
	FINISH_STAGING,
	START_PUBLIC_FUNDING,
	ADD_TIX,
	ADD_IPFS_DETAILS_TO_TIX,
	SET_TIX_PRICE,
	SET_TIX_QUANTITY,
	ADD_DISTRIB,
	SET_DISTRIB_ALLOT_QUAN,
	SET_DISTRIB_FEE,
	SET_MARKUP,
	BUY_TIX_FROM_PROMO,
	BUY_TIX_FROM_DISTRIB,
	WITHDRAW,
	RESOLVER_ADD_ADDR,
	RESOLVER_ADD_PROJ,
	WEB3_CONNECTED,
	PROJ_RESOLVER_DEPLOYED
}
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
