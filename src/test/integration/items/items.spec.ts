import { describe, it, expect } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { authToken, handcashAppSecret, handcashAppId } from '../../env';
import { GetItemsFilter, TransferItemParameters } from '../../../types/items';

describe('# Items - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: handcashAppId,
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);

	it('should get user item inventory', async () => {
		const params: GetItemsFilter = {
			from: 0,
			to: 200,
			isVerified: true,
			attributes: [
				{
					name: 'Edition',
					displayType: 'string',
					value: 'First',
					operation: 'equal',
				},
			],
		};
		const inventory = await cloudAccount.items.getItemsInventory(params);
		expect(Array.isArray(inventory)).toBeTruthy();
		expect(inventory.length).toBeGreaterThan(0);
	});

	it('should get user item listings', async () => {
		const params: GetItemsFilter = {
			from: 0,
			to: 200,
			isVerified: true,
		};
		const inventory = await cloudAccount.items.getItemListings(params);
		expect(Array.isArray(inventory)).toBeTruthy();
		expect(inventory.length).toBeGreaterThan(0);
	});

	it('should transfer an item', async () => {
		const params: TransferItemParameters = {
			destinationsWithOrigins: [
				{
					origins: ['367d112381ec0fcfec8c5598225ae43f66c42c8c5c13ce8a2fcaea0a528249ae_1'],
					destination: 'rafa',
				},
			],
		};
		const result = await cloudAccount.items.transfer(params);
		expect(result.transactionId).toBeDefined();
		expect(Array.isArray(result.transferItems)).toBeTruthy();
		expect(result.transferItems[0]?.participant.name).toEqual('rafa');
	});
});
