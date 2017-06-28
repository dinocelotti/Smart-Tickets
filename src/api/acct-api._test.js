/* eslint-env jest */
import * as api from './acct-api'
import * as deployment from '../../scripts/testHelper'
beforeAll(async () => await deployment.init())
it('returns all accounts', async () => {
	await expect(api.getAcctsAndBals()).resolves.toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				addr: expect.any(String),
				balance: expect.any(String)
			})
		])
	)
})
afterAll(async () => await deployment.end())
