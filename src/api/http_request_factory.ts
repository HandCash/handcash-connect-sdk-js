import { PrivateKey } from 'bsv-wasm';
import axios, { AxiosRequestConfig } from 'axios';
import { nanoid } from 'nanoid';
import { HttpBody, HttpMethod, QueryParams } from '../types/http';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters } from '../types/payments';
import { DataSignatureParameters } from '../types/signature';
import { TxInput, TxLock } from '../types/bsv';

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
	privateKey: PrivateKey | undefined;

	appSecret: string;

	appId: string;

	baseApiEndpoint: string;

	baseTrustholderEndpoint: string;

	constructor({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }: Params) {
		if (authToken) {
			try {
				this.privateKey = PrivateKey.from_hex(authToken);
			} catch (err) {
				throw Error('Invalid authToken');
			}
		}
		if (!appSecret) {
			throw Error('Missing appSecret');
		}
		if (!appId) {
			throw Error('Missing appId');
		}
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
	): AxiosRequestConfig {
		const timestamp = new Date().toISOString();
		const nonce = nanoid();
		const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
		const encodedEndpoint = HttpRequestFactory.getEncodedEndpoint(endpoint, queryParameters);
		const headers: Record<string, string> = {
			'app-id': this.appId,
			'app-secret': this.appSecret,
		};
		if (this.privateKey) {
			const publicKey = this.privateKey.to_public_key();
			headers['oauth-publickey'] = publicKey.to_hex();
			headers['oauth-timestamp'] = timestamp.toString();
			headers['oauth-nonce'] = nonce;
			headers['oauth-signature'] = HttpRequestFactory.getRequestSignature(
				method,
				encodedEndpoint,
				serializedBody,
				timestamp,
				this.privateKey,
				nonce
			);
		}
		return {
			baseURL: this.baseApiEndpoint,
			url: encodedEndpoint,
			method,
			headers,
			data: serializedBody,
			responseType: 'json',
		};
	}

	getTrustholderRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody,
		queryParameters: QueryParams = {}
	): AxiosRequestConfig {
		const encodedEndpoint = HttpRequestFactory.getEncodedEndpoint(endpoint, queryParameters);
		return {
			baseURL: this.baseTrustholderEndpoint,
			url: encodedEndpoint,
			method,
			headers: {},
			data: body,
			responseType: 'json',
		};
	}

	static getEncodedEndpoint(endpoint: string, queryParameters: QueryParams) {
		return axios.getUri({
			url: endpoint,
			params: queryParameters,
		});
	}

	static getRequestSignature(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		privateKey: PrivateKey,
		nonce: string
	): string {
		const signaturePayload = HttpRequestFactory.getRequestSignaturePayload(
			method,
			endpoint,
			serializedBody,
			timestamp,
			nonce
		);
		return privateKey.sign_message(Buffer.from(signaturePayload)).to_hex();
	}

	static getRequestSignaturePayload(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		nonce: string
	) {
		return `${method}\n${endpoint}\n${timestamp}\n${serializedBody}${nonce ? `\n${nonce}` : ''}`;
	}

	getCurrentProfileRequest() {
		return this.getRequest('GET', `${profileEndpoint}/currentUserProfile`);
	}

	getPublicProfilesByHandleRequest(aliases: string[]) {
		const aliasArray = aliases.map((alias, i) => [`aliases[${i}]`, alias]);
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
		this.getRequest('POST', `${accountEndpoint}`, {
			accessPublicKey,
			email,
			...(referrerAlias && { referrerAlias }),
		});

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
			...(paymentParameters.description && { description: paymentParameters.description }),
			...(paymentParameters.appAction && { appAction: paymentParameters.appAction }),
			...(paymentParameters.payments && { receivers: paymentParameters.payments }),
			...(paymentParameters.attachment && { attachment: paymentParameters.attachment }),
		});
	}

	getPaymentRequest(queryParameters: QueryParams) {
		return this.getRequest('GET', `${walletEndpoint}/payment`, {}, queryParameters);
	}

	getExchangeRateRequest(currencyCode: CurrencyCode) {
		return this.getRequest('GET', `${walletEndpoint}/exchangeRate/${currencyCode}`, {});
	}

	getPursePayRequest(rawTransaction: string, inputParents: TxInput[]) {
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

	getOwnerNextAddressRequest(alias?: string) {
		return this.getRequest('GET', `${runExtensionEndpoint}/owner/next`, {}, alias ? { alias } : {});
	}

	getOwnerSignRequest(rawTransaction: string, inputParents: TxInput[], locks: TxLock[]) {
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
