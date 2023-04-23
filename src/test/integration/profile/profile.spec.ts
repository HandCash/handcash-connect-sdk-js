import { describe, it, expect } from 'vitest';
import { PrivateKey, PublicKey } from 'bsv-wasm';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { Permissions } from '../../../types/account';
import { authToken, handcashAppSecret, handcashAppId } from '../../env';

describe('# Profile - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: handcashAppId,
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);

	it('should get user public profile', async () => {
		const publicProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.publicProfile);
		expect(publicProfile.id).to.be.a('string');
	});

	it('should get user private profile', async () => {
		const privateProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.privateProfile);
		expect(privateProfile.email).to.be.a('string');
	});

	it('should get user friends list', async () => {
		const friends = await cloudAccount.profile.getFriends();
		expect(friends).to.be.an('array');
		expect(friends[0]?.id).to.be.a('string');
	});

	it('should get public user profiles by handle', async () => {
		const publicProfiles = await cloudAccount.profile.getPublicProfilesByHandle(['apagut', 'rafa']);
		expect(publicProfiles).to.be.an('array').and.have.length(2);
		expect(publicProfiles[0]?.id).to.be.a('string');
	});

	it('should get current user permissions', async () => {
		const userPermissions = await cloudAccount.profile.getPermissions();
		const expectedPermissions = [
			Permissions.Pay,
			Permissions.UserPublicProfile,
			Permissions.UserPrivateProfile,
			Permissions.Friends,
			Permissions.Decrypt,
			Permissions.SignData,
			Permissions.ReadBalance,
		];
		expect(userPermissions).containSubset(expectedPermissions);
	});

	it('should get current permissions info', async () => {
		const userPermissions = await cloudAccount.profile.getPermissionsInfo();
		const expectedPermissions = [
			Permissions.Pay,
			Permissions.UserPublicProfile,
			Permissions.UserPrivateProfile,
			Permissions.Friends,
			Permissions.Decrypt,
			Permissions.SignData,
			Permissions.ReadBalance,
		];
		expect(userPermissions.items).containSubset(expectedPermissions);
		expect(userPermissions.appId).to.eq(handcashAppId);
	});

	it('should get user encryption keypair', async () => {
		const encryptionKeypair = await cloudAccount.profile.getEncryptionKeypair();
		const { publicKey, privateKey } = encryptionKeypair;
		const newPublicKey = PublicKey.from_hex(publicKey).to_hex();
		const newPrivateKey = PrivateKey.from_wif(privateKey).to_hex();

		expect(newPublicKey).to.be.a('string');
		expect(newPrivateKey).to.be.a('string');
	});

	it('should sign a message', async () => {
		const signature = await cloudAccount.profile.signData({
			format: 'utf-8',
			value: 'hey folks!',
		});
		expect(signature.signature).to.be.a('string');
	});
});
