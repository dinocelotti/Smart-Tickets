/* eslint-env jest  */
/*eslint-env jasmine*/
import * as deployment from '../../scripts/testHelper'
import api from './project-api'
import accApi from './account-api'
import EthApi from './eth-api'
import store from '../store'
import actionCreator from '../actions/project-actions'
import helper from './api-helpers'
import accActions from '../actions/account-actions'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

const ethApi = new EthApi(),
	accounts = [],
	testProjects = [],
	sampleTickets = []

let project, projectResolver

const mapLength = (len, map) => Promise.all(Array.from(Array(len), map))
const logHanderCreator = actionCreators => (err, log) => {
	if (err) {
		console.error(err)
		throw err
	}
	let val
	Object.keys(actionCreators).forEach(key => {
		if (actionCreators[key][log.event])
			val = actionCreators[key][log.event](helper.normalizeArgs(log))
	})
	return val
}

const logHandler = logHanderCreator({ actionCreator })
const projectState = () => store.getState().projectState

const sampleProjectGen = (function* sampleProjectGen() {
	let index = 0
	const projectName = num => `Sample Project ${num}`
	const randomNumGen = seed => () => Math.floor(Math.random() * seed + 6)
	const totalTickets = randomNumGen(100)
	const consumerMaxTickets = randomNumGen(5)
	//eslint-disable-next-line
	while (true) {
		yield {
			projectName: projectName(index),
			totalTickets: totalTickets(),
			consumerMaxTickets: consumerMaxTickets(),
			promoterAddress: ''
		}

		index++
	}
})()
const sampleTicketGen = (function* sampleTicketGen() {
	let index = 0
	const ticketType = num => `TicketType${num}`
	const randomNumGen = seed => () => Math.floor(Math.random() * seed + 2)
	const ticketPrice = randomNumGen(50)
	const ticketQuantity = randomNumGen(5)
	//eslint-disable-next-line
	while (true) {
		yield {
			ticketType: ticketType(index),
			ticketPrice: ticketPrice(),
			ticketQuantity: ticketQuantity()
		}
		index++
	}
})()

for (let i = 0; i < 10; i++) {
	sampleTickets.push(sampleTicketGen.next().value)
}
console.log(sampleTickets)
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
	store.dispatch(accActions.getAccounts())
	await mapLength(1, () =>
		api.createProject({
			...sampleProjectGen.next().value,
			promoterAddress: accounts[0]
		})
	)
})
it('should retreive those projects using a filter and dispatch them to the store', async done => {
	const logs = []
	const event = projectResolver.AddProject(
		{},
		{ fromBlock: 0, toBlock: 'pending' }
	)
	event.watch(async (error, log) => {
		logs.push(log)
		const _log = helper.normalizeArgs(log)
		console.error(_log)
		const { data: { project: _p } } = _log
		const p = await project.at(_p)
		testProjects.push(p)
		p.allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
			console.log(logHandler(err, _log))
			store.dispatch(logHandler(err, _log))
			console.log(store.getState().projectState)

			if (logs.length === 1) done()
		})
	})
})

it('should add a ticket to the project and test for its events', async done => {
	const project = projectState().byId[projectState().ids[0]]
	const promoter = new api.Promoter(project)
	try {
		await promoter.init()
		await promoter.handleTicketForm(sampleTickets[0])
		await promoter.addIpfsDetailsToTicket({
			ipfsHash: 'TESTHASH',
			...sampleTickets[0]
		})
	} catch (e) {
		console.error(e)
	}
	testProjects[0].allEvents(
		{ fromBlock: 0, toBlock: 'pending' },
		(err, _log) => {
			console.error(logHandler(err, _log))
			store.dispatch(logHandler(err, _log))
			console.log(JSON.stringify(store.getState().projectState, null, 1))
			console.log(JSON.stringify(store.getState().ticketState, null, 1))
			done()
		}
	)
})

it('should add a distributor and test for its events', async done => {
	const project = projectState().byId[projectState().ids[0]]
	const promoter = new api.Promoter(project)
	const distributor = {
		distributor: accounts[1],
		ticketType: sampleTickets[0].ticketType,
		distributorAllottedQuantity: sampleTickets[0].ticketQuantity - 1,
		promoterFee: 10
	}
	try {
		await promoter.init()
		await promoter.addDistributor(accounts[1])
		await promoter.setDistributorAllottedQuantity(distributor)
		await promoter.setDistributorFee(distributor)
	} catch (e) {
		console.error(e)
	}
	testProjects[0].allEvents(
		{ fromBlock: 0, toBlock: 'pending' },
		(err, _log) => {
			console.error(JSON.stringify(logHandler(err, _log), null, 1))
			store.dispatch(logHandler(err, _log))
			console.log(JSON.stringify(store.getState().projectState, null, 1))
			console.log(JSON.stringify(store.getState().distributorState, null, 1))
			done()
		}
	)
})
//test setmarkup after
afterAll(async () => {
	await deployment.end()
	console.log(JSON.stringify(store.getState(), null, 1))
})
