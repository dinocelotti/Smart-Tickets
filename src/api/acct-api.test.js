/* eslint-env jest */
import * as api from './acct-api'
import * as deployment from '../../scripts/testHelper'
beforeAll(async () => await deployment.init())
it('returns all accounts', async () => {
	try {
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
	} catch (e) {
		console.log(e)
	}
})
afterAll(async () => await deployment.end())
