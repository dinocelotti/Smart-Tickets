/* eslint-env jest */
import * as api from './proj-api';
import * as accApi from './acct-api';
import store from '../store';
import { projResolverDeploySuccess } from '../actions/proj-actions';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
const sampleProj = {
	projName: 'sample project1',
	totalTixs: '100',
	consumMaxTixs: '3',
	promoAddr: ''
};
const sampleTix1 = {
	tixType: 'regular',
	tixPrice: '1000',
	tixQuantity: '10'
};
let accountAddrs = [];
let loadedProjs = [];

const testrpc = require('ethereumjs-testrpc');
const server = testrpc.server();
/**
 *const spawnSync = require('child_process').spawnSync
spawnSync('bash test.sh', { shell: true })
 *
 */

beforeAll(async () => {
	store.dispatch(projResolverDeploySuccess(await api.deployProjResolver()));
	console.log('after dispatch');
	accountAddrs = await accApi.getAcctsAndBals();
	sampleProj.promoAddr = accountAddrs[0].addr;
});

it('should create a proj', async () => {
	await expect(api.createProj(sampleProj)).resolves.toEqual(
		expect.objectContaining({
			projName: expect.any(String),
			totalTixs: expect.any(String),
			consumMaxTixs: expect.any(String),
			promoAddr: expect.any(String),
			projAddr: expect.any(String)
		})
	);
});

it('should return a proj with this address', async () => {
	await expect(api.getAssocProjs()).resolves.toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				assocProjs: expect.arrayContaining([expect.any(String)]),
				acct: expect.any(String)
			})
		])
	);
});

it('should load all projs', async () => {
	let res = await api.loadProjs();
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
	);
	loadedProjs = res;
});

it('should have 100 tix left', async () => {
	console.log(loadedProjs);
	const promo = new api.Promo(accountAddrs[0].addr, loadedProjs[0].addr);
	await promo.init();
	await expect(promo.getTixsLeft()).resolves.toEqual('100');
});
