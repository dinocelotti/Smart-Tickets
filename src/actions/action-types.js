//accounts
const GET_ACCOUNTS_SUCCESS = 'GET_ACCOUNTS_SUCCESS'

const CREATED = 'CREATED'
const FINISH_STAGING = 'FINISH_STAGING'
const START_PUBLIC_FUNDING = 'START_PUBLIC_FUNDING'

const ADD_TICKET = 'ADD_TICKET'
const ADD_IPFS_DETAILS_TO_TICKET = 'ADD_IPFS_DETAILS_TO_TICKET'
const SET_TICKET_PRICE = 'SET_TICKET_PRICE'
const SET_TICKET_QUANTITY = 'SET_TICKET_QUANTITY'

const ADD_DISTRIBUTOR = 'ADD_DISTRIBUTOR'
const SET_DISTRIBUTOR_ALLOTTED_QUANTITY = 'SET_DISTRIBUTOR_ALLOTTED_QUANTITY'
const SET_DISTRIBUTOR_FEE = 'SET_DISTRIBUTOR_FEE'
const SET_MARKUP = 'SET_MARKUP'
const BUY_TICKET_FROM_PROMOTER = 'BUY_TICKET_FROM_PROMOTER'
const BUY_TICKET_FROM_DISTRIBUTOR = 'BUY_TICKET_FROM_DISTRIBUTOR'
const WITHDRAW = 'WITHDRAW'

const WEB3_CONNECTED = 'WEB3_CONNECTED'
const PROJECT_RESOLVER_DEPLOYED = 'PROJECT_RESOLVER_DEPLOYED'

export default {
	GET_ACCOUNTS_SUCCESS,
	CREATED,
	FINISH_STAGING,
	START_PUBLIC_FUNDING,
	ADD_TICKET,
	ADD_IPFS_DETAILS_TO_TICKET,
	SET_TICKET_PRICE,
	SET_TICKET_QUANTITY,
	ADD_DISTRIBUTOR,
	SET_DISTRIBUTOR_ALLOTTED_QUANTITY,
	SET_DISTRIBUTOR_FEE,
	SET_MARKUP,
	BUY_TICKET_FROM_PROMOTER,
	BUY_TICKET_FROM_DISTRIBUTOR,
	WITHDRAW,
	WEB3_CONNECTED,
	PROJECT_RESOLVER_DEPLOYED
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
