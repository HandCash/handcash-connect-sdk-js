import { describe, expect, it } from 'vitest';
import Environments from '../../environments';
import HandCashConnect from '../../handcash_connect';

describe('# HandCashConnect - Unit Tests', () => {
	it('should initialize with default environment', async () => {
		const appId = '1234567890';
		const appSecret = '1234567890';
		const handCashConnect = new HandCashConnect({
			appId,
			appSecret,
		});
		expect(handCashConnect.env).to.eq(Environments.prod);
	});

	it('should raise an invalid auth token error', async () => {
		const authToken = 'invalid-token-123';
		const appSecret = '1234567890';
		const appId = 'id1';
		return expect(() =>
			new HandCashConnect({
				appSecret,
				appId,
			}).getAccountFromAuthToken(authToken)
		).to.throw('Invalid authToken');
	});
});
