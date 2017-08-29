/* eslint-env node */

import Web3 from 'web3'
import contract from 'truffle-contract'
import store from '../store'
import web3Actions from '../actions/web3-actions'
const path = require('path')
const fs = require('fs')
let Project = require('../../build/contracts/Project.json')
let ProjectResolver = require('../../build/contracts/ProjectResolver')
/**
 * 
 * 
 * @export
 * @class API
 * This class is used to hold and create instances of contracts and web3. Caching mechanisms are used to reduce the lengthy load times of making instances of contracts. 
 */
class API {
	project
	projectResolver
	provider
	web3
	deployed = { projectResolver: {} } // Used for caching the instantiated projectResolver
	projectsAtAddress = {} // Used for caching projects that have been instantiated with .at() beforehand

	/**
	 * Creates an instance of API. 
	 * @memberof API
	 */
	constructor() {
		if (!this.provider) {
			// Create a provider if one does not exist yet.
			this.provider = new Web3.providers.HttpProvider('http://localhost:8545')
		}
		if (!this.web3) {
			// Create web3 instance if one does not exist yet.
			this.web3 = new Web3(this.provider)
			store.dispatch(web3Actions.web3Connected())
		}
	}
	getProjectResolver() {
		return this.deployed
	}
	/**
	 * @param {string} { address } Address of the project to retrieve, if it's already been made then the cached instance will be returned
	 * @returns 
	 * @memberof API
	 */
	async getProjectAtAddress({ address }) {
		//console.group('GetProjectAtAddress')
		console.log('Getting projectAtAddress ' + address)
		if (!this.projectsAtAddress[address]) {
			console.warn('Instance not created, making...')
			const p = await this.project.at(address)
			this.projectsAtAddress[address] = p
		} else {
			console.log('Instance already exists, return cached project')
		}
		//console.groupEnd()
		return this.projectsAtAddress[address]
	}
	/**
	 *  Used for Jest testing to load the newly deployed smart contract files
	 * 
	 * @param {string} module 
	 * @returns 
	 * @memberof API
	 */
	readJSON(module) {
		// eslint-disable-next-line
		return JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/${module}`)))
	}

	/**
	 * Deploy a contract on the network, storing it in this class instance. Dispatch an action when finished to alert the client of the change
	 * 
	 * @param {string, string} { _contract, name } 
	 * @returns 
	 * @memberof API
	 */
	async deployContract({ _contract, name }) {
		this.deployed[name] = await _contract.deployed()
		//if its projectResolver then dispatch the action
		if (name === 'projectResolver')
			store.dispatch(web3Actions.projectResolverDeployed())
		return true
	}

	/**
	 * Change the current web3 provider
	 * 
	 * @param {string} _provider 
	 * @memberof API
	 */
	changeProvider(_provider) {
		//TODO: will need to dispatch an action for changed providers
		this.provider = new Web3.providers.HttpProvider(_provider)
	}

	/**
	 * If in testing env (node) then read the new contract files in 
	 * Create new instances of Project and ProjectResolver and set their providers
	 * @memberof API
	 */
	async reloadContracts() {
		//for node use only
		if (typeof process === 'object') {
			Project = this.readJSON('../../build/contracts/Project.json')
			ProjectResolver = this.readJSON(
				'../../build/contracts/ProjectResolver.json'
			)
		}
		await this.loadContracts()
	}

	/**
	 * Create new instances of Project and ProjectResolver and set their providers
	 * 
	 * @memberof API
	 */
	async loadContracts() {
		if (!this.project || !this.projectResolver) {
			this.project = await contract(Project)
			this.projectResolver = await contract(ProjectResolver)
			await this.project.setProvider(this.provider)
			await this.projectResolver.setProvider(this.provider)
		}
	}
}

export default new API()
