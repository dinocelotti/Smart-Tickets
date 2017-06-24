/* eslint-env jest */
import * as api from './acct-api'
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
