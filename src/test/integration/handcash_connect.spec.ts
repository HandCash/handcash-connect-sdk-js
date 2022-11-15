import { describe, it, expect } from 'vitest';
import Environments from '../../environments';
import HandCashConnect from '../../handcash_connect';
import { handcashAppId, handcashAppSecret } from '../env';

describe('# HandCash Connect - Integration Tests', () => {
	const handCashConnect = new HandCashConnect({
		appId: handcashAppId,
		appSecret: handcashAppSecret,
		env: Environments.iae,
	});

	it('should request email code, verify it and create new account', async () => {
		const email = 'app.review@handcash.io';
		const verificationCode = '12345678';
		const keyPair = handCashConnect.generateAuthenticationKeyPair();
		const requestId = await handCashConnect.requestEmailCode(email);
		await handCashConnect.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
		const cretedProfile = await handCashConnect.createNewAccount(keyPair.publicKey, email);
		expect(cretedProfile.id).toBeTypeOf('string');

		const cloudAccount = handCashConnect.getAccountFromAuthToken(keyPair.privateKey);
		const profileFromAuthToken = await cloudAccount.profile.getCurrentProfile();
		expect(profileFromAuthToken.publicProfile.id).toBeTypeOf('string');

		expect(profileFromAuthToken.publicProfile.id).to.eq(cretedProfile.id);
	});
});
