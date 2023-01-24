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

	/**
	 *
	 * Get HandCashConnect Cloud Account with Wallet and Profile APIs
	 *
	 * @param {string} params.authToken - Your personal auth token. Should be a hex string.
	 * @param {string} params.appId - The app id of your app. You get it from your developer dashboard.
	 * @param {string} params.appSecret - The app secret of your app. You get it from your developer dashboard.
	 * @param {string} params.baseApiEndpoint - Base Api Endpoint URL string.
	 * @param {string} params.baseTrustholderEndpoint - Base Trustholder Endpoint URL string.
	 *
	 */

	static fromAuthToken(params: Params) {
		const { authToken, appId, appSecret, baseApiEndpoint, baseTrustholderEndpoint } = params;
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
