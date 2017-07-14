/* eslint-env jest */
import Web3 from 'web3'
import contract from 'truffle-contract'
let path = require('path')
let fs = require('fs')
let Proj = require('../../build/contracts/Proj.json')
let ProjResolver = require('../../build/contracts/ProjResolver')

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

	readJSON(module) {
		// eslint-disable-next-line
		return JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/${module}`)))
	}

	async deployContract({ _contract, name }) {
		API.deployed[name] = await _contract.deployed()
		return true
	}
	changeProvider(_provider) {
		API.provider = new Web3.providers.HttpProvider(_provider)
	}

	async reloadContracts() {
		//for node use only
		if (typeof process === 'object') {
			Proj = this.readJSON('../../build/contracts/Proj.json')
			ProjResolver = this.readJSON('../../build/contracts/ProjResolver.json')
		}
		return await this.loadContracts()
	}
	async loadContracts() {
		if (!API.proj || !API.projResolver) {
			API.proj = await contract(Proj)
			API.projResolver = await contract(ProjResolver)
			await API.proj.setProvider(API.provider)
			await API.projResolver.setProvider(API.provider)
		}
	}
}
