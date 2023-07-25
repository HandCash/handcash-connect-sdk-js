import { describe, it, expect } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { authToken, handcashAppSecret, handcashAppId } from '../../env';
import { GetItemsParameters } from '../../../types/items';

describe('# Items - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: handcashAppId,
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);

	it('should get user item inventory', async () => {
		const params: GetItemsParameters = {
			from: 0,
			to: 200,
			isVerified: true,
			traits: [
				{
					name: 'Edition',
					displayType: 'string',
					value: 'Test',
					operation: 'equal',
				},
			],
		};
		const inventory = await cloudAccount.items.getItemsInventory(params);
		expect(Array.isArray(inventory)).toBeTruthy();
		expect(inventory.length).toBeGreaterThan(0);
		const filteredResult =
			inventory[0]?.attributes.filter(
				(attribute) => attribute.name === 'Edition' && attribute.value === 'Test'
			) || [];
		expect(filteredResult.length).toBeGreaterThan(0);
	});

	it('should get user item listings', async () => {
		const params: GetItemsParameters = {
			from: 0,
			to: 200,
			isVerified: true,
		};
		const inventory = await cloudAccount.items.getItemListings(params);
		expect(Array.isArray(inventory)).toBeTruthy();
		expect(inventory.length).toBeGreaterThan(0);
	});
});