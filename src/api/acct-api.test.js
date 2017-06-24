/* eslint-env jest */
import * as api from './acct-api';
it('returns all accounts', async () => {
	await expect(api.getAcctsAndBals()).resolves.toHaveLength(10);
});
