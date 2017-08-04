/* eslint-env jest*/
//eslint-disable-next-line
const Web3 = require('web3')
const contract = require('truffle-contract')
import * as deployment from '../scripts/testHelper'
import accApi from '../src/api/account-api'
import EthApi from '../src/api/eth-api'
import projectApi from '../src/api/project-api'
const Project = require('../build/contracts/Project.json')

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)
const ethApi = new EthApi()
let project
let projectResolver
let accounts
beforeAll(async () => {
	try {
		await deployment.init()
		await ethApi.reloadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projectResolver,
			name: 'projectResolver'
		})
		project = EthApi.project
		projectResolver = EthApi.deployed.projectResolver
	} catch (e) {
		console.log(e.stack)
	}
})

it('should add a bunch of projects to the first account', async () => {
	accounts = await accApi.getAccountsAsync()
	console.log(accounts)
})

describe('Project', () => {
	it('should instantiate the project', async done => {
		await projectApi.createProject({
			projectName: 'myCoolProject',
			consumerMaxTickets: 2,
			promoterAddress: accounts[0],
			totalTickets: 100
		})
		const event = projectResolver.AddProject(
			{},
			{ fromBlock: 0, toBlock: 'pending' }
		)
		//find the project address
		event.watch(async (error, log) => {
			//watch the project and find it
			const p = await project.at(log.args._project)
			p.allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
				console.log(_log)
				done()
			})
		})
	})
})
