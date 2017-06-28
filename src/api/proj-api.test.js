/* eslint-env jest */
import * as deployment from '../../scripts/testHelper'
deployment.init()
import * as api from './proj-api'
import * as accApi from './acct-api'

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
		accountAddrs = await accApi.getAcctsAndBals()
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

it('should have 100 tix left', async () => {
	console.log(loadedProjs)
	const promo = new api.Promo(accountAddrs[0].addr, loadedProjs[0].addr)
	await promo.init()
	await expect(promo.getTixsLeft()).resolves.toEqual('100')
})

afterAll(async () => await deployment.end())
