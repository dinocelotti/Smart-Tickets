import Web3 from 'web3'
import contract from 'truffle-contract'
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)

const initialState = {
	contract,
	provider,
	web3
}
export default (state = initialState, action) => {
	if (action.type.web3Connected) {
		return { ...state, web3: action.web3, projResolver: action.projResolver, proj: action.proj }
	}
	return state
}
