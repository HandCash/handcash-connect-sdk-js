import { describe, it, expect } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { handcashAppSecret } from '../../env';

describe('# Authorization - Integration Tests', () => {
	it('should get a redirection URL to authorize app', async () => {
		const appId = '1234567890';
		const handCashConnect = new HandCashConnect({
			appId,
			appSecret: handcashAppSecret,
			env: Environments.prod,
		});
		const redirectionLoginUrl = handCashConnect.getRedirectionUrl();

		expect(redirectionLoginUrl).toBeTypeOf('string');
		expect(redirectionLoginUrl).includes(Environments.prod.clientUrl);
		expect(redirectionLoginUrl).includes(appId);
	});

	it('should get a redirection URL to authorize app for default environment (prod)', async () => {
		const appId = '1234567890';
		const handCashConnect = new HandCashConnect({
			appId,
			appSecret: handcashAppSecret,
			env: Environments.prod,
		});
		const redirectionLoginUrl = handCashConnect.getRedirectionUrl();

		expect(redirectionLoginUrl).toBeTypeOf('string');
		expect(redirectionLoginUrl).includes(Environments.prod.clientUrl);
		expect(redirectionLoginUrl).includes(appId);
	});
});
