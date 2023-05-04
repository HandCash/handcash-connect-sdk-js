import HandCashConnectService from '../api/handcash_connect_service';
import Environments from '../environments';

export default class HandCashOwner {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	static fromAuthToken(authToken: string, env = Environments.prod, appSecret = '', appId = '') {
		const handCashConnectService = new HandCashConnectService({
			authToken,
			baseApiEndpoint: env.apiEndpoint,
			baseTrustholderEndpoint: env.trustholderEndpoint,
			appSecret,
			appId,
		});
		return new HandCashOwner(handCashConnectService);
	}

	async nextOwner(alias: string): Promise<string> {
		const res = await this.handCashConnectService.ownerNextAddress(alias);
		return res.ownerAddress;
	}

	async sign(rawTransaction: string, inputParents: unknown[], locks: unknown[]): Promise<string> {
		const res = await this.handCashConnectService.ownerSign(rawTransaction, inputParents, locks);
		return res.signedTransaction;
	}

	async getNftLocations(): Promise<string[]> {
		const res = await this.handCashConnectService.getNftLocations();
		return res.nftLocations;
	}
}
