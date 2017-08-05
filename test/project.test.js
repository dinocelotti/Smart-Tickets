/* eslint-env jest*/
//eslint-disable-next-line
import * as deployment from '../scripts/testHelper'
import accApi from '../src/api/account-api'
import EthApi from '../src/api/eth-api'
import projectApi from '../src/api/project-api'
import utils from '../src/api/api-helpers'
import prettyjson from 'prettyjson'

//eslint-disable-next-line
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
const ethApi = new EthApi()
let project,
	projectInstance,
	projectResolver,
	accounts,
	promoterInstance,
	distributorInstance

const ticketsToAdd = []
const printLogsFromEvent = ({ logs }) =>
	logs.forEach(log => console.log(prettyjson.render(utils.normalizeArgs(log))))
const sampleProjectGen = (function* sampleProjectGen() {
	let index = 0
	const projectName = num => `Sample Project ${num}`
	const randomNumGen = seed => () => Math.floor(Math.random() * seed + 100)
	const consumerMaxTickets = randomNumGen(5)
	//eslint-disable-next-line
	while (true) {
		yield {
			projectName: projectName(index),
			totalTickets: 100,
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
	//eslint-disable-next-line
	while (true) {
		yield {
			ticketType: ticketType(index),
			ticketPrice: ticketPrice(),
			ticketQuantity: 100
		}
		index++
	}
})()
for (let index = 0; index < 3; index++) {
	ticketsToAdd.push(sampleTicketGen.next().value)
}
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
	it('should instantiate the project and store its instance', async done => {
		const sampleProject = sampleProjectGen.next().value
		sampleProject.promoterAddress = accounts[0]
		await projectApi.createProject(sampleProject)
		const event = projectResolver.AddProject(
			{},
			{ fromBlock: 0, toBlock: 'pending' }
		)

		//find the project address
		event.watch(async (error, log) => {
			//watch the project and find it
			projectInstance = await project.at(log.args._project)
			projectInstance.allEvents(
				{ fromBlock: 0, toBlock: 'pending' },
				(err, _log) => {
					console.log(utils.normalizeArgs(_log))
					event.stopWatching()

					done()
				}
			)
		})
	})
	it('should add 3 types of tickets and their values', async done => {
		try {
			promoterInstance = new projectApi.Promoter({
				promoter: accounts[0],
				address: projectInstance.address
			})
			await promoterInstance.init()
			//take up all the tickets instead
			const res = await promoterInstance.handleTicketForm(ticketsToAdd[0])
			printLogsFromEvent(res)
		} catch (e) {
			console.error(e)
		}
		done()
	})
	it('should add a distributor and assign it to the first ticket', async () => {
		const distributorToAdd = {
			distributor: accounts[1],
			ticketType: ticketsToAdd[0].ticketType,
			distributorAllottedQuantity: ticketsToAdd[0].ticketQuantity,
			promoterFee: 10
		}
		const results = []
		results.push(await promoterInstance.addDistributor(accounts[1]))
		results.push(
			await promoterInstance.setDistributorAllottedQuantity(distributorToAdd)
		)
		results.push(await promoterInstance.setDistributorFee(distributorToAdd))
		results.forEach(event => printLogsFromEvent(event))
	})
	it('should let the distributor set the markup on the tickets to 10%', async () => {
		try {
			distributorInstance = new projectApi.Buyer({
				buyerAddress: accounts[1],
				isDistributor: true,
				projectAddress: projectInstance.address
			})
			await distributorInstance.init()
			const res = await distributorInstance.setMarkup({
				markup: 10,
				ticketType: ticketsToAdd[0].ticketType
			})
			printLogsFromEvent(res)
		} catch (e) {
			console.error(e)
		}
	})

	it('should move the project to the next stage', async () => {
		const res = await promoterInstance.finishStaging()
		printLogsFromEvent(res)
	})
	it('should let the distributor buy all of the tickets', async () => {
		console.error('Ticket price: ', {
			...ticketsToAdd[0],
			txObj: {
				value: ticketsToAdd[0].ticketQuantity * ticketsToAdd[0].ticketPrice
			}
		})
		const res = await distributorInstance.buyTicketFromPromoter({
			...ticketsToAdd[0],
			txObj: {
				value:
					ticketsToAdd[0].ticketQuantity * ticketsToAdd[0].ticketPrice + 100
			}
		})
		printLogsFromEvent(res)
	})
})
afterAll(async () => {
	await deployment.end()
})
