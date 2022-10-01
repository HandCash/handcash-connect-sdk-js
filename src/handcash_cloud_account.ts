import HandCashConnectService from './api/handcash_connect_service';
import HttpRequestFactory from './api/http_request_factory';
import Wallet from './wallet';
import Profile from './profile';

type Params = {
	authToken: string;
	appSecret: string;
	appId: string;
	baseApiEndpoint: string;
	baseTrustholderEndpoint: string;
};

export default class HandCashCloudAccount {
	wallet: Wallet;

	profile: Profile;

	constructor(wallet: Wallet, profile: Profile) {
		this.wallet = wallet;
		this.profile = profile;
	}

	static fromAuthToken({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }: Params) {
		const handCashConnectService = new HandCashConnectService(
			new HttpRequestFactory({
				authToken,
				baseApiEndpoint,
				baseTrustholderEndpoint,
				appSecret,
				appId,
			})
		);
		const wallet = new Wallet(handCashConnectService);
		const profile = new Profile(handCashConnectService);
		return new HandCashCloudAccount(wallet, profile);
	}
}
