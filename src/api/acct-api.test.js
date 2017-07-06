/* eslint-env jest */
import * as api from './acct-api'
import * as deployment from '../../scripts/testHelper'
import EthApi from './eth-api'
const ethApi = new EthApi()
beforeAll(async () => {
	await deployment.init()
	await ethApi.reloadContracts()
	await ethApi.deployContract({
		_contract: EthApi.projResolver,
		name: 'projResolver'
	})
})
it('returns all accounts', async () => {
	await expect(api.getAcctsAndBals()).resolves.toEqual(
		expect.objectContaining({
			accts: expect.arrayContaining([
				expect.objectContaining({
					addr: expect.any(String),
					balance: expect.any(String)
				})
			])
		})
	)
})
afterAll(async () => await deployment.end())
