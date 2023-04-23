import { describe, it, expect } from 'vitest';
import Run from 'run-sdk';
import Environments from '../../../environments';
import HandCashOwner from '../../../run_extension/handcash_owner';
import HandCashPurse from '../../../run_extension/handcash_purse';
import { authToken, handcashAppId, handcashAppSecret } from '../../env';
import ownerTests from './owner_tests';
import CustomBlockchain from './custom_blockchain_plugin';

describe('# HandCashOwner - Integration Tests', () => {
	const env = Environments.iae;
	const handcashOwner = HandCashOwner.fromAuthToken({
		authToken,
		env,
		appSecret: handcashAppSecret,
		appId: handcashAppId,
	});
	const handcashPurse = HandCashPurse.fromAuthToken({
		authToken,
		env,
		appSecret: handcashAppSecret,
		appId: handcashAppId,
	});
	const blockchain = new CustomBlockchain();
	it('should pass the owner tests defined by the Run SDK', async () => {
		const run = new Run({
			owner: handcashOwner,
			purse: handcashPurse,
			blockchain,
		});
		await ownerTests(run);
	}, 30000);
	it('should get an address for the given alias', async () => {
		const address = await handcashOwner.nextOwner('tester');
		expect(address).toBeTypeOf('string');
	});
	it('should get the NFT locations', async () => {
		const locations = await handcashOwner.getNftLocations();
		expect(locations).toBeTypeOf('object');
	});
});
