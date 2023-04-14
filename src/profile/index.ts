import { PrivateKey, ECIES, ECIESCiphertext, PublicKey } from 'bsv-wasm';
import HandCashConnectService from '../api/handcash_connect_service';
import { Permissions, PermissionsInfo, UserProfile, UserPublicProfile } from '../types/account';
import { KeyPair } from '../types/bsv';
import { DataSignature, DataSignatureParameters } from '../types/signature';

export default class Profile {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 *
	 * Gets the full profile of the user with his public and private profile.
	 *
	 * @returns {Promise<UserProfile>} A promise that resolves to the user profile.
	 */
	async getCurrentProfile(): Promise<UserProfile> {
		return this.handCashConnectService.getCurrentProfile();
	}

	/**
	 *
	 * Gets the public profile of any handcash user.
	 *
	 * @param {string[]} handles - The user handles.
	 *
	 * @returns {Promise<UserPublicProfile[]>} A promise that resolves to the public profiles of the users.
	 *
	 */
	async getPublicProfilesByHandle(handles: string[]): Promise<UserPublicProfile[]> {
		return this.handCashConnectService.getPublicProfilesByHandle(handles).then((result) => result.items);
	}

	/**
	 *
	 * Returns a list of the user's friends amd their public profiles.
	 * Requires the FRIENDS permission.
	 *
	 * @returns {Promise<UserPublicProfile[]>} A promise that resolves to the public profiles of the user's friends.
	 */
	async getFriends(): Promise<UserPublicProfile[]> {
		return this.handCashConnectService.getUserFriends().then((result) => result.items);
	}

	/**
	 *
	 * Returns the permissions granted to the app by the user.
	 *
	 * @returns {Promise<Permissions[]>} A promise that resolves to the user's permissions.
	 *
	 */
	async getPermissions(): Promise<Permissions[]> {
		return this.handCashConnectService.getUserPermissions().then((result) => result.items);
	}

	/**
	 *
	 * Returns the permissions granted to the app by the user along with the app id.
	 *
	 * @returns {Promise<PermissionsInfo>} A promise that resolves to PermissionsInfo.
	 *
	 */
	async getPermissionsInfo(): Promise<PermissionsInfo> {
		return this.handCashConnectService.getUserPermissions().then((result) => result);
	}

	/**
	 *
	 * Gets the users public and private encryption keys.
	 *
	 * @returns {Promise<KeyPair>} A promise that resolves to the user's key pair.
	 *
	 */
	async getEncryptionKeypair(): Promise<KeyPair> {
		const privateKey = PrivateKey.from_random();
		const encryptedKeypair = await this.handCashConnectService.getEncryptionKeypair(
			privateKey.to_public_key().to_hex()
		);
		const senderPubKey = PublicKey.from_hex(encryptedKeypair.senderPublicKeyHex);

		return {
			publicKey: Buffer.from(
				ECIES.decrypt(
					ECIESCiphertext.from_bytes(Buffer.from(encryptedKeypair.encryptedPublicKeyHex, 'hex'), true),
					privateKey,
					senderPubKey
				)
			).toString(),
			privateKey: Buffer.from(
				ECIES.decrypt(
					ECIESCiphertext.from_bytes(Buffer.from(encryptedKeypair.encryptedPrivateKeyHex, 'hex'), true),
					privateKey,
					senderPubKey
				)
			).toString(),
		};
	}

	/**
	 *
	 * Signs a message with the user's private key.
	 * Requires the SIGN_DATA permission.
	 *
	 * @param {Object} dataSignatureParameters - The data to sign.
	 * @param {string} dataSignatureParameters.value - The value of the data.
	 * @param {string} dataSignatureParameters.format - The format of the data. Can be 'utf-8', 'base64' or 'hex'.
	 *
	 * @returns {Promise<DataSignature>} A promise that resolves to the data signature.
	 *
	 */
	async signData(dataSignatureParameters: DataSignatureParameters): Promise<DataSignature> {
		return this.handCashConnectService.signData(dataSignatureParameters);
	}
}
