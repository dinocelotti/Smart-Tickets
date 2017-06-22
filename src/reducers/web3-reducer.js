import Proj from '../../build/contracts/Proj.json'
import ProjResolver from '../../build/contracts/ProjResolver.json'
import Web3 from 'web3'
import contract from 'truffle-contract'
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const proj = contract(Proj)
const projResolver = contract(ProjResolver)
proj.setProvider(provider)
projResolver.setProvider(provider)

const initialState = {
	contract,
	proj,
	projResolver,
	provider
}
export default (state = initialState, action) => state
