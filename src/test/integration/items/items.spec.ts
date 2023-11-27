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
					name: 'Country',
					displayType: 'string',
					value: 'Berkshire',
					operation: 'equal',
				},
			],
			fetchAttributes: true,
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
					origins: ['6334a1802911d6ae6c596270308221ef9d9caf1e323304f2c8b33719bed315ce_42'],
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
