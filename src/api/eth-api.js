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
 * This class is used to hold and create instances of contracts and web3. Caching mechanisms are used to reduce the lengthy load times of making instances of contracts. Static properties are used to share the same instance across modules.
 */
export default class API {
	static project
	static projectResolver
	static provider
	static web3
	static deployed = { projectResolver: {} } // Used for caching the instantiated projectResolver
	static projectsAtAddress = {} // Used for caching projects that have been instantiated with .at() beforehand

	/**
	 * Creates an instance of API. 
	 * @memberof API
	 */
	constructor() {
		if (!API.provider) {
			// Create a provider if one does not exist yet.
			API.provider = new Web3.providers.HttpProvider('http://localhost:8545')
		}
		if (!API.web3) {
			// Create web3 instance if one does not exist yet.
			API.web3 = new Web3(API.provider)
			store.dispatch(web3Actions.web3Connected())
		}
	}
	getProjectResolver() {
		return API.deployed
	}
	/**
	 * @param {string} { address } Address of the project to retrieve, if it's already been made then the cached instance will be returned
	 * @returns 
	 * @memberof API
	 */
	async getProjectAtAddress({ address }) {
		//console.group('GetProjectAtAddress')
		console.log('Getting projectAtAddress ' + address)
		if (!API.projectsAtAddress[address]) {
			console.warn('Instance not created, making...')
			const p = await API.project.at(address)
			API.projectsAtAddress[address] = p
		} else {
			console.log('Instance already exists, return cached project')
		}
		//console.groupEnd()
		return API.projectsAtAddress[address]
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
		API.deployed[name] = await _contract.deployed()
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
		API.provider = new Web3.providers.HttpProvider(_provider)
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
		if (!API.project || !API.projectResolver) {
			API.project = await contract(Project)
			API.projectResolver = await contract(ProjectResolver)
			await API.project.setProvider(API.provider)
			await API.projectResolver.setProvider(API.provider)
		}
	}
}
