/* eslint-env jest */
import Web3 from 'web3'
import contract from 'truffle-contract'
//import { readFileSync } from 'fs'
import Proj from '../../build/contracts/Proj.json'
import ProjResolver from '../../build/contracts/ProjResolver'
export default class API {
	static proj
	static projResolver
	static provider
	static web3
	static deployed = { projResolver: {} }

	constructor() {
		if (!API.provider) {
			API.provider = new Web3.providers.HttpProvider('http://localhost:8545')
		}
		if (!API.web3) {
			API.web3 = new Web3(API.provider)
		}
	}
	/*
	readJSON(module) {
		return JSON.parse(readFileSync(require.resolve(module)))
	}*/

	async deployContract({ _contract, name }) {
		console.log('deploying')
		API.deployed[name] = await _contract.deployed()
		console.log('deployed')
		return true
	}
	changeProvider(_provider) {
		API.provider = new Web3.providers.HttpProvider(_provider)
	}

	async reloadContracts() {
		return await this.loadContracts()
	}
	async loadContracts() {
		if (!API.proj || !API.projResolver) {
			//let load = typeof process === 'object' ? this.readJSON :

			API.proj = await contract(Proj)
			API.projResolver = await contract(ProjResolver)
			await API.proj.setProvider(API.provider)
			await API.projResolver.setProvider(API.provider)
		}
	}
}
