/* eslint-env jest */
import api from './account-api'
import * as deployment from '../../scripts/testHelper'
import ethApi from './eth-api'
beforeAll(async () => {
	await deployment.init()
	await ethApi.reloadContracts()
	await ethApi.deployContract({
		_contract: ethApi.projectResolver,
		name: 'projectResolver'
	})
})
it('returns all accounts', async () => {
	await expect(api.getAccountsAndBals()).resolves.toEqual(
		expect.objectContaining({
			accounts: expect.arrayContaining([
				expect.objectContaining({
					address: expect.any(String),
					balance: expect.any(String)
				})
			])
		})
	)
})
afterAll(async () => await deployment.end())
