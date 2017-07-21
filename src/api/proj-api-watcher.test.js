/* eslint-env jest  */
/*eslint-env jasmine*/
import * as deployment from '../../scripts/testHelper'
import * as api from './proj-api'
import * as accApi from './acct-api'
import EthApi from './eth-api'
import store from '../store'
import * as actionCreator from '../actions/proj-actions'
import helper from './api-helpers'
import * as accActions from '../actions/acct-actions'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

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
let accounts = []
const testProjs = []
const sampleTixs = []
const projState = () => store.getState().projState
const ethApi = new EthApi()
let proj, projResolver
const sampleProjGen = (function* sampleProjGen() {
	let index = 0
	const projName = num => `Sample Project ${num}`
	const randomNumGen = seed => () => Math.floor(Math.random() * seed + 6)
	const totalTix = randomNumGen(100)
	const consumMaxTixs = randomNumGen(5)
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
	const tixType = num => `TixType${num}`
	const randomNumGen = seed => () => Math.floor(Math.random() * seed + 2)
	const tixPrice = randomNumGen(50)
	const tixQuantity = randomNumGen(5)
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

for (let i = 0; i < 10; i++) {
	sampleTixs.push(sampleTixGen.next().value)
}
console.log(sampleTixs)
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

it('should add a bunch of projs to the first account', async () => {
	accounts = await accApi.getAcctsAsync()
	console.log(accounts)
	store.dispatch(accActions.getAccts())
	await mapLength(1, () =>
		api.createProj({
			...sampleProjGen.next().value,
			promoAddr: accounts[0]
		})
	)
})
it('should retreive those projs using a filter and dispatch them to the store', async done => {
	const logs = []
	const event = projResolver.AddProj({}, { fromBlock: 0, toBlock: 'pending' })
	event.watch(async (error, log) => {
		logs.push(log)
		const _log = helper.normalizeArgs(log)
		console.error(_log)
		const { data: { proj: _p } } = _log
		const p = await proj.at(_p)
		testProjs.push(p)
		p.allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
			console.log(logHandler(err, _log))
			store.dispatch(logHandler(err, _log))
			console.log(store.getState().projState)

			if (logs.length === 1) done()
		})
	})
})

it('should add a tix to the proj and test for its events', async done => {
	const proj = projState().byId[projState().ids[0]]
	const promo = new api.Promo(proj)
	try {
		await promo.init()
		await promo.handleTixForm(sampleTixs[0])
		await promo.addIpfsDetailsToTix({
			ipfsHash: 'TESTHASH',
			...sampleTixs[0]
		})
	} catch (e) {
		console.error(e)
	}
	testProjs[0].allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
		console.error(logHandler(err, _log))
		store.dispatch(logHandler(err, _log))
		console.log(JSON.stringify(store.getState().projState, null, 1))
		console.log(JSON.stringify(store.getState().tixState, null, 1))
		done()
	})
})

it('should add a distrib and test for its events', async done => {
	const proj = projState().byId[projState().ids[0]]
	const promo = new api.Promo(proj)
	const distrib = {
		distrib: accounts[1],
		tixType: sampleTixs[0].tixType,
		tixQuantity: sampleTixs[0].tixQuantity - 1,
		promosFee: 10
	}
	try {
		await promo.init()
		await promo.addDistrib(accounts[1])
		await promo.setDistribAllotQuan(distrib)
		await promo.setDistribFee(distrib)
	} catch (e) {
		console.error(e)
	}
	testProjs[0].allEvents({ fromBlock: 0, toBlock: 'pending' }, (err, _log) => {
		console.error(JSON.stringify(logHandler(err, _log), null, 1))
		store.dispatch(logHandler(err, _log))
		console.log(JSON.stringify(store.getState().projState, null, 1))
		console.log(JSON.stringify(store.getState().distribState, null, 1))
		done()
	})
})
//test setmarkup after
afterAll(async () => {
	await deployment.end()
	console.log(JSON.stringify(store.getState(), null, 1))
})
