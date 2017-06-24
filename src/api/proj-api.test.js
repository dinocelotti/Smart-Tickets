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
let accountAddrs = [];

beforeAll(async () => {
	store.dispatch(projResolverDeploySuccess(await api.deployProjResolver()));
	accountAddrs = await accApi.getAcctsAndBals();
	sampleProj.promoAddr = accountAddrs[0].addr;
	return accountAddrs;
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
	await expect(api.loadProjs()).resolves.toEqual(
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
});
