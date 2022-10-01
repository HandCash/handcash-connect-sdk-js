import { PrivateKey, PublicKey } from 'bsv';
import HandCashCloudAccount from './handcash_cloud_account';
import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import HttpRequestFactory from './api/http_request_factory';
import { KeyPair } from './types/bsv';
import { UserPublicProfile } from './types/account';

type Params = {
	appId: string;
	appSecret: string;
	env?: typeof Environments['prod'];
};

export default class HandCashConnect {
	appId: string;

	appSecret: string;

	handCashConnectService: HandCashConnectService;

	env: typeof Environments['prod'];

	constructor({ appId, appSecret, env = Environments.prod }: Params) {
		this.appId = appId;
		this.appSecret = appSecret;
		this.env = env;
		this.handCashConnectService = new HandCashConnectService(
			new HttpRequestFactory({
				appId: this.appId,
				appSecret: this.appSecret,
				baseApiEndpoint: this.env.apiEndpoint,
				baseTrustholderEndpoint: this.env.trustholderEndpoint,
			})
		);
	}

	getRedirectionUrl(queryParameters: Record<string, string> = {}) {
		// eslint-disable-next-line no-param-reassign
		queryParameters.appId = this.appId;
		const encodedParams = Object.entries(queryParameters)
			.map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val.toString())}`)
			.join('&');
		return `${this.env.clientUrl}/#/authorizeApp?${encodedParams}`;
	}

	getChangeSpendLimitsUrl(redirectUrl = false) {
		const url = `${this.env.clientUrl}/#/settings/spendLimits`;
		return url + (redirectUrl ? `?redirectUrl=${redirectUrl}` : '');
	}

	// eslint-disable-next-line class-methods-use-this
	generateAuthenticationKeyPair = (): KeyPair => {
		const privateKey = PrivateKey.fromRandom();
		const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
		return {
			privateKey: privateKey.toHex(),
			publicKey: publicKey.toHex(),
		};
	};

	requestEmailCode(email: string): Promise<string> {
		return this.handCashConnectService.requestEmailCode(email);
	}

	verifyEmailCode(requestId: string, verificationCode: string, accessPublicKey: string): Promise<void> {
		return this.handCashConnectService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
	}

	createNewAccount(accessPublicKey: string, email: string, referrerAlias: string): Promise<UserPublicProfile> {
		return this.handCashConnectService.createNewAccount(accessPublicKey, email, referrerAlias);
	}

	getAccountFromAuthToken(authToken: string) {
		return HandCashCloudAccount.fromAuthToken({
			authToken,
			appSecret: this.appSecret,
			appId: this.appId,
			baseApiEndpoint: this.env.apiEndpoint,
			baseTrustholderEndpoint: this.env.trustholderEndpoint,
		});
	}
}
