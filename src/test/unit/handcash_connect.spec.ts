import { describe, it, expect } from 'vitest';
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
		expect(handCashConnect.env).toBe(Environments.prod);
	});
});
