import { describe, it } from 'vitest';
import Run from 'run-sdk';
import purseTests from './purse_tests';
import Environments from '../../../environments';
import HandCashOwner from '../../../run_extension/handcash_owner';
import HandCashPurse from '../../../run_extension/handcash_purse';
import { authToken, handcashAppId, handcashAppSecret } from '../../env';
import CustomBlockchain from './custom_blockchain_plugin';

describe('# HandCashPurse - Integration Tests', () => {
	const env = Environments.iae;
	const handcashOwner = HandCashOwner.fromAuthToken(authToken, env, handcashAppSecret, handcashAppId);
	const handcashPurse = HandCashPurse.fromAuthToken(authToken, env, handcashAppSecret, handcashAppId);
	const blockchain = new CustomBlockchain();
	
	it('should pass the purse tests defined by the Run SDK', async () => {
		const run = new Run({
			owner: handcashOwner,
			purse: handcashPurse,
			blockchain,
		});
		await purseTests(run, false);
	}, 30000);
});
