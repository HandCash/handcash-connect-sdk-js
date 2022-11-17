import { PrivateKey } from 'bsv-wasm';
import { HttpBody, HttpMethod, QueryParams, RequestParams } from '../types/http';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters } from '../types/payments';
import { DataSignatureParameters } from '../types/signature';

const profileEndpoint = '/v1/connect/profile';
const accountEndpoint = '/v1/connect/account';
const walletEndpoint = '/v1/connect/wallet';
const runExtensionEndpoint = '/v1/connect/runExtension';

type Params = {
	authToken?: string;
	appSecret: string;
	appId: string;
	baseApiEndpoint: string;
	baseTrustholderEndpoint: string;
};

export default class HttpRequestFactory {
	authToken: string | undefined;

	appSecret: string;

	appId: string;

	baseApiEndpoint: string;

	baseTrustholderEndpoint: string;

	constructor({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }: Params) {
		if (authToken && !PrivateKey.from_hex(authToken)) {
			throw Error('Invalid authToken');
		}
		if (!appSecret) {
			throw Error('Missing appSecret');
		}
		if (!appId) {
			throw Error('Missing appId');
		}
		this.authToken = authToken;
		this.appSecret = appSecret;
		this.appId = appId;
		this.baseApiEndpoint = baseApiEndpoint;
		this.baseTrustholderEndpoint = baseTrustholderEndpoint;
	}

	getRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody = {},
		queryParameters: QueryParams = {}
	): [string, RequestParams] {
		const timestamp = new Date().toISOString();
		const serializedBody = JSON.stringify(body) === '{}' ? undefined : JSON.stringify(body);
		const encodedEndpoint = HttpRequestFactory.getEncodedEndpoint(endpoint, queryParameters);
		const headers: Record<string, string> = {
			'app-id': this.appId,
			'app-secret': this.appSecret,
		};
		if (this.authToken) {
			const privateKey = PrivateKey.from_hex(this.authToken);
			const publicKey = privateKey.to_public_key();
			headers['oauth-publickey'] = publicKey.to_hex();
			headers['oauth-timestamp'] = timestamp.toString();
			headers['oauth-signature'] = HttpRequestFactory.getRequestSignature(
				method,
				encodedEndpoint,
				serializedBody,
				timestamp,
				privateKey
			);
		}
		return [`${this.baseApiEndpoint}${encodedEndpoint}`, { method, headers, body: serializedBody }];
	}

	getTrustholderRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody,
		queryParameters: QueryParams = {}
	): [string, RequestParams] {
		const encodedEndpoint = HttpRequestFactory.getEncodedEndpoint(endpoint, queryParameters);
		return [`${this.baseTrustholderEndpoint}/${encodedEndpoint}`, { method, body: JSON.stringify(body) }];
	}

	static getEncodedEndpoint(endpoint: string, queryParameters: QueryParams) {
		return `${endpoint}?${new URLSearchParams(queryParameters).toString()}`;
	}

	static getRequestSignature(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		privateKey: PrivateKey
	): string {
		const signaturePayload = HttpRequestFactory.getRequestSignaturePayload(
			method,
			endpoint,
			serializedBody,
			timestamp
		);
		return privateKey.sign_message(Buffer.from(signaturePayload).reverse()).to_der_hex();
	}

	static getRequestSignaturePayload(method: HttpMethod, endpoint: string, serializedBody: string | undefined, timestamp: string) {
		return `${method}\n${endpoint}\n${timestamp}\n${serializedBody ?? ''}`;
	}

	getCurrentProfileRequest() {
		return this.getRequest('GET', `${profileEndpoint}/currentUserProfile`);
	}

	getPublicProfilesByHandleRequest(aliases: string[]) {
		const aliasArray = aliases.map((alias) => ['aliases[]', alias]);
		return this.getRequest(
			'GET',
			`${profileEndpoint}/publicUserProfiles`,
			{},
			{
				...Object.fromEntries(aliasArray),
			}
		);
	}

	requestEmailCodeRequest = (email: string) =>
		this.getRequest('POST', `${accountEndpoint}/requestEmailCode`, { email });

	verifyEmailCodeRequest = (requestId: string, verificationCode: string, publicKey: string) =>
		this.getTrustholderRequest('POST', `/auth/verifyCode`, { requestId, verificationCode, publicKey });

	createNewAccountRequest = (accessPublicKey: string, email: string, referrerAlias?: string) =>
		this.getRequest('POST', `${accountEndpoint}`, { accessPublicKey, email, referrerAlias });

	getUserFriendsRequest() {
		return this.getRequest('GET', `${profileEndpoint}/friends`);
	}

	getUserPermissionsRequest() {
		return this.getRequest('GET', `${profileEndpoint}/permissions`);
	}

	getEncryptionKeypairRequest(encryptionPublicKey: string) {
		return this.getRequest(
			'GET',
			`${profileEndpoint}/encryptionKeypair`,
			{},
			{
				encryptionPublicKey,
			}
		);
	}

	getDataSignatureRequest(dataSignatureParameters: DataSignatureParameters) {
		return this.getRequest('POST', `${profileEndpoint}/signData`, {
			format: dataSignatureParameters.format,
			value: dataSignatureParameters.value,
		});
	}

	getSpendableBalanceRequest(currencyCode?: CurrencyCode) {
		return this.getRequest('GET', `${walletEndpoint}/spendableBalance`, {}, currencyCode ? { currencyCode } : {});
	}

	getTotalBalanceRequest() {
		return this.getRequest('GET', `${walletEndpoint}/balance`);
	}

	getPayRequest(paymentParameters: PaymentParameters) {
		return this.getRequest('POST', `${walletEndpoint}/pay`, {
			description: paymentParameters.description,
			appAction: paymentParameters.appAction,
			receivers: paymentParameters.payments,
			attachment: paymentParameters.attachment,
		});
	}

	getPaymentRequest(queryParameters: QueryParams) {
		return this.getRequest('GET', `${walletEndpoint}/payment`, {}, queryParameters);
	}

	getExchangeRateRequest(currencyCode: CurrencyCode) {
		return this.getRequest('GET', `${walletEndpoint}/exchangeRate/${currencyCode}`, {});
	}

	getPursePayRequest(rawTransaction: string, inputParents: unknown[]) {
		return this.getRequest('POST', `${runExtensionEndpoint}/purse/pay`, {
			rawTransaction,
			inputParents,
		});
	}

	getPurseBroadcastRequest(rawTransaction: string) {
		return this.getRequest('POST', `${runExtensionEndpoint}/purse/broadcast`, {
			rawTransaction,
		});
	}

	getOwnerNextAddressRequest(alias: string) {
		return this.getRequest(
			'GET',
			`${runExtensionEndpoint}/owner/next`,
			{},
			{
				alias,
			}
		);
	}

	getOwnerSignRequest(rawTransaction: string, inputParents: unknown[], locks: unknown[]) {
		return this.getRequest('POST', `${runExtensionEndpoint}/owner/sign`, {
			rawTransaction,
			inputParents,
			locks,
		});
	}

	getNftLocationsRequest() {
		return this.getRequest('GET', `${runExtensionEndpoint}/owner/nftLocations`, {});
	}
}
