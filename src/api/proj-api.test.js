/* eslint-env jest */
import * as deployment from '../../scripts/testHelper'
import * as api from './proj-api'
import * as accApi from './acct-api'
import * as apiTypes from './proj-types'
import utils from './api-helpers'
import store from '../store'
import { projResolverDeploySuccess } from '../actions/proj-actions'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000
const sampleProj = {
	projName: 'sample project1',
	totalTixs: '100',
	consumMaxTixs: '3',
	promoAddr: ''
}
const sampleTix1 = {
	tixType: 'regular',
	tixPrice: '1000',
	tixQuantity: '10'
}
let txObject = { tx: expect.any(String), receipt: expect.any(Object) }
let accountAddrs = []
let loadedProjs = []
function requireUncached(module) {
	delete require.cache[require.resolve(module)]
	return require(module)
}
beforeAll(async () => {
	try {
		await deployment.init()
		let { web3, provider, contract } = store.getState().web3State
		const Proj = requireUncached('../../build/contracts/Proj.json')
		const ProjResolver = requireUncached('../../build/contracts/ProjResolver.json')

		let currentNetwork = web3.version.network
		console.log('currentnetwork:', currentNetwork)
		const proj = contract(Proj)
		const projResolver = contract(ProjResolver)
		proj.setProvider(provider)
		projResolver.setProvider(provider)
		store.dispatch({ type: { web3Connected: true }, web3, proj, projResolver })
		store.dispatch(projResolverDeploySuccess(await api.deployProjResolver()))
		accountAddrs = (await accApi.getAcctsAndBals()).accts
	} catch (e) {
		console.log(e.stack)
	}
	sampleProj.promoAddr = accountAddrs[0].addr
	return accountAddrs
})

it('should create a proj', async () => {
	await expect(api.createProj(sampleProj)).resolves.toEqual(
		expect.objectContaining({
			projName: expect.any(String),
			totalTixs: expect.any(String),
			consumMaxTixs: expect.any(String),
			promoAddr: expect.any(String),
			projAddr: expect.any(String)
		})
	)
})

it('should return a proj with this address', async () => {
	await expect(api.getAssocProjs()).resolves.toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				assocProjs: expect.arrayContaining([expect.any(String)]),
				acct: expect.any(String)
			})
		])
	)
})

it('should load all projs', async () => {
	let res = await api.loadProjs()
	expect(res).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				projName: expect.any(String),
				totalTixs: expect.any(String),
				consumMaxTixs: expect.any(String),
				promoAddr: expect.any(String),
				addr: expect.any(String),
				tix: expect.arrayContaining([]),
				distribs: expect.arrayContaining([])
			})
		])
	)
	loadedProjs = res
})

describe('promoter tests', async () => {
	let promo

	it('should have 100 tix left', async () => {
		console.log(loadedProjs)
		promo = new api.Promo(accountAddrs[0].addr, loadedProjs[0].addr)
		await promo.init()
		await expect(promo.getTixsLeft()).resolves.toEqual('100')
	})
	it('should add a sample tix', async () => {
		let promise = promo.handleTixForm(sampleTix1)
		await expect(promise).resolves.toEqual(expect.objectContaining(txObject))
		//console.log(await promise)
		//check we actually set the value after
		let tixVals = await promo.getTixVals(sampleTix1.tixType)
		expect(tixVals).toEqual({
			...sampleTix1,
			//convert to base10 first

			tixType: (+apiTypes.encodeString(sampleTix1.tixType)).toString(10)
		})
	})
	it('should return 90 tix left', async () => {
		await expect(promo.getTixsLeft()).resolves.toEqual('90')
	})
	it('should add the 2nd account as a distrib', async () => {
		let buyerAddr = accountAddrs[1].addr
		let promise = promo.addDistrib(buyerAddr)
		await expect(promise).resolves.toEqual(expect.objectContaining(txObject))

		//check they are a distribtor
		await expect(promo.queryBuyer({ buyerAddr, tixType: 0 })).resolves.toEqual(
			expect.arrayContaining([true, '0', '0', '0'])
		)
	})
	it('should set the distribAllotQuan', async () => {
		let buyerAddr = accountAddrs[1].addr
		let promise = promo.setDistribAllotQuan(buyerAddr, sampleTix1.tixType, 2)
		await expect(promise).resolves.toEqual(expect.objectContaining(txObject))

		//check it was properly set
		await expect(promo.queryBuyer({ buyerAddr, tixType: sampleTix1.tixType })).resolves.toEqual(
			expect.arrayContaining([true, '2', '0', '0'])
		)
	})
	it('should set distribFee', async () => {
		let buyerAddr = accountAddrs[1].addr
		let promise = promo.setDistribFee(buyerAddr, 25)
		await expect(promise).resolves.toEqual(expect.objectContaining(txObject))

		//check it was properly set
		await expect(promo.queryBuyer({ buyerAddr, tixType: sampleTix1.tixType })).resolves.toEqual(
			expect.arrayContaining([true, '2', '0', '25'])
		)
	})
})
/**
 * 
 */
it('should load the one distrib', async () => {
	console.log(loadedProjs[0].addr)
	let promise = api.loadDistribs(loadedProjs[0].addr)
	await expect(promise).resolves.toEqual(
		expect.objectContaining({ projAddr: loadedProjs[0].addr, distribs: [accountAddrs[1].addr] })
	)
})
describe('distrib tests', () => {
	it('should set the markup on the tix', async () => {
		let distribAddr = accountAddrs[1].addr
		let buyer = new api.Buyer(distribAddr, loadedProjs[0].addr, true)
		await buyer.init()
		await expect(buyer.setMarkup(100, sampleTix1.tixType)).resolves.toEqual(expect.objectContaining(txObject))

		//make sure it was marked up properly
		//check it was properly set
		await expect(buyer.queryBuyer({ buyerAddr: distribAddr, tixType: sampleTix1.tixType })).resolves.toEqual(
			expect.arrayContaining([true, '2', '100', '25'])
		)
	})
})

afterAll(async () => await deployment.end())
