import { describe, it, expect } from 'vitest';
import { Permissions } from '../../..';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { authToken, handcashAppSecret } from '../../env';
import encryptionKeypairApiDefinition from './encryptionKeypair.api-definition';
import privateUserProfileApiDefinition from './privateUserProfile.api-definition';
import publicUserProfileApiDefinition from './publicUserProfile.api-definition';
import signatureApiDefinition from './signature.api-definition';

describe('# Profile - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: 'appId',
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);

	it('should get user public profile', async () => {
		const publicProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.publicProfile);

		expect(publicUserProfileApiDefinition).toMatchObject(publicProfile);
	});

	it('should get user private profile', async () => {
		const privateProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.privateProfile);

		expect(privateUserProfileApiDefinition).toMatchObject(privateProfile);
	});

	it('should get user friends list', async () => {
		const friends = await cloudAccount.profile.getFriends();
		expect(friends).to.be.an('array');
		expect(publicUserProfileApiDefinition).toMatchObject(friends[0]);
	});

	it('should get public user profiles by handle', async () => {
		const publicProfiles = await cloudAccount.profile.getPublicProfilesByHandle(['tester']);

		expect(publicProfiles).to.be.an('array').and.have.length(1);
		expect(publicUserProfileApiDefinition).toMatchObject(publicProfiles[0]);
	});

	it('should get current user permissions', async () => {
		const userPermissions = await cloudAccount.profile.getPermissions();

		expect(userPermissions).toContain(Permissions.Pay);
		expect(userPermissions).toContain(Permissions.UserPublicProfile);
		expect(userPermissions).toContain(Permissions.UserPrivateProfile);
		expect(userPermissions).toContain(Permissions.Friends);
		expect(userPermissions).toContain(Permissions.Decryption);
		expect(userPermissions).toContain(Permissions.SignData);
		expect(userPermissions).toContain(Permissions.ReadBalance);
	});

	it('should get user encryption keypair', async () => {
		const encryptionKeypair = await cloudAccount.profile.getEncryptionKeypair();

		expect(encryptionKeypairApiDefinition).toMatchObject(encryptionKeypair);
	});

	it('should sign a message', async () => {
		const signature = await cloudAccount.profile.signData({
			format: 'utf-8',
			value: 'hey folks!',
		});

		expect(signatureApiDefinition).toMatchObject(signature);
	});
});
