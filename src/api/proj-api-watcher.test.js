/* eslint-env jest  */
/*eslint-env jasmine*/
import * as deployment from '../../scripts/testHelper'
import * as api from './proj-api'
import * as accApi from './acct-api'
import * as apiTypes from './proj-types'
import EthApi from './eth-api'
import store from '../store'
import * as actionCreator from '../actions/proj-actions'
import helper from './api-helpers'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

const mapLength = (len, map) => Promise.all(Array.from(Array(len), map))
/**
 * 
 */
let projHandler = {
	Created: () => {},
	FinishStaging: () => {},
	StartPrivateFunding: () => {},
	AddTix: () => {},
	AddIpfsDetailsToTix: () => {},
	SetTixPrice: () => {},
	SetTixQuantity: () => {},
	AddDistrib: () => {},
	SetDistribAllotQuan: () => {},
	SetDistribFee: () => {},
	SetMarkup: () => {},
	BuyTixFromPromo: () => {},
	BuyTixFromDistrib: () => {},
	Withdraw: () => {}
}
let projResolverHandler = {
	Created: () => {},
	AddProj: () => {},
	AddAddr: () => {}
}
let logHanderCreator = actionCreators => (log, err) => {
	if (err) throw err

	return Object.keys(actionCreators).forEach(key => {
		actionCreators[key][log.event]
			? actionCreators[key][log.event](helper.normalizeArgs(log))
			: null
	})
}
let logHandler = logHanderCreator({ projHandler, projResolverHandler })

let ethApi = new EthApi()
let proj, projResolver
const sampleProjGen = (function* sampleProjGen() {
	let index = 0
	let projName = num => `Sample Project ${num}`
	let randomNumGen = seed => () => Math.floor(Math.random() * seed + 1)
	let totalTix = randomNumGen(100)
	let consumMaxTixs = randomNumGen(5)
	//eslint-disable-next-line
	while (true) {
		yield {
			projName: projName(index),
			totalTixs: totalTix(),
			consumMaxTixs: consumMaxTixs(),
			promoAddr: ''
		}

		index++
	}
})()

beforeAll(async () => {
	try {
		await deployment.init()
		await ethApi.reloadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projResolver,
			name: 'projResolver'
		})
		proj = EthApi.proj
		projResolver = EthApi.deployed.projResolver
	} catch (e) {
		console.log(e.stack)
	}
})

it('should add a bunch of projs to the first accout', async () => {
	let accounts = await accApi.getAcctsAsync()
	console.log(accounts)

	await mapLength(1, () =>
		api.createProj({
			...sampleProjGen.next().value,
			promoAddr: accounts[0]
		})
	)
})
it('should retreive those projs using a filter and dispatch them to the store', async done => {
	let logs = []
	let event = projResolver.AddProj({}, { fromBlock: 0, toBlock: 'pending' })
	event.watch(async (error, log) => {
		logs.push(log)
		let _log = helper.normalizeArgs(log)
		console.log(_log)
		let { addr, proj: _p } = _log
		let p = await proj.at(_p)
		p.Created({}, { fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
			let normalizedLog = helper.normalizeArgs(_log)
			console.log(normalizedLog)
			console.log(actionCreator.Created(normalizedLog))
			store.dispatch(actionCreator.Created(normalizedLog))
			console.log(store.getState().projState)
			if (logs.length === 1) done()
		})
	})
})
//it('should test the time to retrive via array', () => {

afterAll(async () => await deployment.end())
