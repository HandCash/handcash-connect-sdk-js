import { PrivateKey, Ecies } from 'bsv';
import HandCashConnectService from '../api/handcash_connect_service';
import { Permissions, UserProfile, UserPublicProfile } from '../types/account';
import { KeyPair } from '../types/bsv';
import { DataSignature, DataSignatureParameters } from '../types/signature';

export default class Profile {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	async getCurrentProfile(): Promise<UserProfile> {
		return this.handCashConnectService.getCurrentProfile();
	}

	async getPublicProfilesByHandle(handles: string[]): Promise<UserPublicProfile[]> {
		return this.handCashConnectService.getPublicProfilesByHandle(handles).then((result) => result.items);
	}

	async getFriends(): Promise<UserPublicProfile[]> {
		return this.handCashConnectService.getUserFriends().then((result) => result.items);
	}

	async getPermissions(): Promise<Permissions> {
		return this.handCashConnectService.getUserPermissions().then((result) => result.items);
	}

	async getEncryptionKeypair(): Promise<KeyPair> {
		const privateKey = PrivateKey.fromRandom();
		const encryptedKeypair = await this.handCashConnectService.getEncryptionKeypair(
			privateKey.publicKey.toString()
		);
		return {
			publicKey: Ecies()
				.privateKey(privateKey)
				.decrypt(Buffer.from(encryptedKeypair.encryptedPublicKeyHex, 'hex'))
				.toString(),
			privateKey: Ecies()
				.privateKey(privateKey)
				.decrypt(Buffer.from(encryptedKeypair.encryptedPrivateKeyHex, 'hex'))
				.toString(),
		};
	}

	async signData(dataSignatureParameters: DataSignatureParameters): Promise<DataSignature> {
		return this.handCashConnectService.signData(dataSignatureParameters);
	}
}
