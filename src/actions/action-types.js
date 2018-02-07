//accounts
const GET_ACCOUNTS_SUCCESS = 'GET_ACCOUNTS_SUCCESS'
// Events
const CREATED = 'CREATED'
const FINISH_STAGING = 'FINISH_STAGING'
// tickets
const ADD_TICKET = 'ADD_TICKET'
const TICKET_LISTED = 'TICKET_LISTED'
const TICKET_RESERVED = 'TICKET_RESERVED'
const BUY_TICKET = 'BUY_TICKET'
const CLAIM_RESERVED = 'CLAIM_RESERVED'
//  distributors
const ADD_DISTRIBUTOR = 'ADD_DISTRIBUTOR'
const GIVE_ALLOWANCE = 'GIVE_ALLOWANCE'
const WITHDRAW = 'WITHDRAW'
// web3 / project resolver
const WEB3_CONNECTED = 'WEB3_CONNECTED'
const PROJECT_RESOLVER_DEPLOYED = 'PROJECT_RESOLVER_DEPLOYED'
// user account
const SET_USER_ADDRESS = 'SET_USER_ADDRESS'

export default {
	GET_ACCOUNTS_SUCCESS,
	CREATED,
	FINISH_STAGING,
	ADD_TICKET,
	TICKET_LISTED,
	TICKET_RESERVED,
	BUY_TICKET,
	CLAIM_RESERVED,
	ADD_DISTRIBUTOR,
	GIVE_ALLOWANCE,
	WITHDRAW,
	WEB3_CONNECTED,
	PROJECT_RESOLVER_DEPLOYED,
	SET_USER_ADDRESS
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
