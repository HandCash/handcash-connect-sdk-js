const Run = require('run-sdk');

const { HandCashOwner, HandCashPurse, Environments } = require('../../../src/index');
const purseTests = require('./purse_tests');

describe('# HandCashPurse - Integration Tests', () => {
	before(async () => {
		const authToken = process.env.test_authToken;
		const appSecret = process.env.app_secret;
		const appId = process.env.app_id;
		const env = Environments.iae;
		this.handcashOwner = HandCashOwner.fromAuthToken(authToken, env, appSecret, appId);
		this.handcashPurse = HandCashPurse.fromAuthToken(authToken, env, appSecret, appId);
	});

	it('should pass the purse tests defined by the Run SDK', async () => {
		const run = new Run({
			owner: this.handcashOwner,
			purse: this.handcashPurse,
		});
		await purseTests(run, false);
	}).timeout(30000);
});
