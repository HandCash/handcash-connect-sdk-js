import { describe, it, expect } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { handcashAppSecret } from '../../env';

describe('# Spend Limits - Integration Tests', () => {
	it('should get a redirection URL to change the spend limits', async () => {
		const appId = '1234567890';
		const handCashConnect = new HandCashConnect({
			appId,
			appSecret: handcashAppSecret,
			env: Environments.iae,
		});
		const redirectUrl = 'https://mysite.com';
		const changeSpendLimitsUrl = handCashConnect.getChangeSpendLimitsUrl(redirectUrl);

		expect(changeSpendLimitsUrl).toBeTypeOf('string');
		expect(changeSpendLimitsUrl).includes(Environments.iae.clientUrl);
		expect(changeSpendLimitsUrl).includes(redirectUrl);
	});

	it('should get a redirection URL to change the spend limits without redirection url', async () => {
		const appId = '1234567890';
		const handCashConnect = new HandCashConnect({
			appId,
			appSecret: handcashAppSecret,
			env: Environments.iae,
		});
		const changeSpendLimitsUrl = handCashConnect.getChangeSpendLimitsUrl();

		expect(changeSpendLimitsUrl).toBeTypeOf('string');
		expect(changeSpendLimitsUrl).includes(Environments.iae.clientUrl);
	});
});
