import HandCashConnectService from '../api/handcash_connect_service';
import HttpRequestFactory from '../api/http_request_factory';
import Environments from '../environments';

export default class HandCashPurse {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	static fromAuthToken(authToken: string, env = Environments.prod, appSecret = '', appId = '') {
		const handCashConnectService = new HandCashConnectService(
			new HttpRequestFactory({
				authToken,
				baseApiEndpoint: env.apiEndpoint,
				baseTrustholderEndpoint: env.trustholderEndpoint,
				appSecret,
				appId,
			})
		);
		return new HandCashPurse(handCashConnectService);
	}

	async pay(rawTx: string, parents: unknown[]): Promise<unknown> {
		const res = await this.handCashConnectService.pursePay(rawTx, parents);
		return res.partiallySignedTx;
	}

	async broadcast(rawTx: string): Promise<void> {
		await this.handCashConnectService.purseBroadcast(rawTx);
	}
}
