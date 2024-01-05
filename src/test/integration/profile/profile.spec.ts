import { describe, it, expect } from 'vitest';
import { PrivateKey, PublicKey } from 'bsv-wasm';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { Permission } from '../../../types/account';
import { authToken, handcashAppSecret, handcashAppId } from '../../env';

describe('# Profile - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: handcashAppId,
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);

	it('should get user public profile', async () => {
		const publicProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.publicProfile);
		expect(publicProfile.id).eq('612cba9a1610e70b56d9b837');
	});

	it('should get user private profile', async () => {
		const privateProfile = await cloudAccount.profile.getCurrentProfile().then((profile) => profile.privateProfile);
		expect(privateProfile.email).toBeTypeOf('string');
	});

	it('should get user friends list', async () => {
		const friends = await cloudAccount.profile.getFriends();
		expect(Array.isArray(friends)).toBeTruthy();
		expect(friends[0]?.id).toBeTypeOf('string');
	});

	it('should get public user profiles by handle', async () => {
		const publicProfiles = await cloudAccount.profile.getPublicProfilesByHandle(['midas', 'rafa']);
		expect(publicProfiles).toHaveLength(2);
		expect(publicProfiles[0]?.id).toBeTypeOf('string');
	});

	it('should get current user permissions', async () => {
		const userPermissions = await cloudAccount.profile.getPermissions();
		expect(userPermissions).toContain(Permission.Pay);
		expect(userPermissions).toContain(Permission.UserPublicProfile);
		expect(userPermissions).toContain(Permission.UserPrivateProfile);
		expect(userPermissions).toContain(Permission.Friends);
		expect(userPermissions).toContain(Permission.Decrypt);
		expect(userPermissions).toContain(Permission.SignData);
		expect(userPermissions).toContain(Permission.ReadBalance);
	});

	it('should get full permissions info for the current user', async () => {
		const permissionInfo = await cloudAccount.profile.getPermissionsInfo();
		expect(permissionInfo.appId).toEqual(handcashAppId);
		expect(permissionInfo.items).toContain(Permission.Pay);
		expect(permissionInfo.items).toContain(Permission.UserPublicProfile);
		expect(permissionInfo.items).toContain(Permission.UserPrivateProfile);
		expect(permissionInfo.items).toContain(Permission.Friends);
		expect(permissionInfo.items).toContain(Permission.Decrypt);
		expect(permissionInfo.items).toContain(Permission.SignData);
		expect(permissionInfo.items).toContain(Permission.ReadBalance);
	});

	it('should get user encryption keypair', async () => {
		const encryptionKeypair = await cloudAccount.profile.getEncryptionKeypair();
		const { publicKey, privateKey } = encryptionKeypair;
		const newPublicKey = PublicKey.from_hex(publicKey).to_hex();
		const newPrivateKey = PrivateKey.from_wif(privateKey).to_hex();

		expect(newPublicKey).toBeTypeOf('string');
		expect(newPrivateKey).toBeTypeOf('string');
	});

	it('should sign a message', async () => {
		const signature = await cloudAccount.profile.signData({
			format: 'utf-8',
			value: 'hey folks!',
		});
		expect(signature.signature).toBeTypeOf('string');
	});
});
