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
	Created: () => 'hi',
	AddProj: () => {},
	AddAddr: () => {}
}
let logHanderCreator = actionCreators => (err, log) => {
	if (err) throw err
	let val
	Object.keys(actionCreators).forEach(key => {
		if (actionCreators[key][log.event])
			val = actionCreators[key][log.event](helper.normalizeArgs(log))
	})
	return val
}
let logHandler = logHanderCreator({ actionCreator })

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
const sampleTixGen = (function* sampleTixGen() {
	let index = 0
	let tixType = num => `TixType${num}`
	let randomNumGen = seed => () => Math.floor(Math.random() * seed + 1)
	let tixPrice = randomNumGen(50)
	let tixQuantity = randomNumGen(50)
	//eslint-disable-next-line
	while (true) {
		yield {
			tixType: tixType(index),
			tixPrice: tixPrice(),
			tixQuantity: tixQuantity()
		}
		index++
	}
})()
console.error(sampleTixGen.next().value)
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
		let { addr, proj: _p } = _log
		let p = await proj.at(_p)
		p.allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
			store.dispatch(logHandler(err, _log))
			console.log(store.getState().projState)
			if (logs.length === 1) done()
		})
	})
})

afterAll(async () => await deployment.end())
