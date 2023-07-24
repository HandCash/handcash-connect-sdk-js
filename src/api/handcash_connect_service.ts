import axios, { AxiosRequestConfig } from 'axios';
import { PrivateKey } from 'bsv-wasm';
import { nanoid } from 'nanoid';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters } from '../types/payments';
import { DataSignatureParameters } from '../types/signature';
import HandCashConnectApiError from './handcash_connect_api_error';
import { HttpBody, HttpMethod, QueryParams } from '../types/http';
import { EncryptionKeypair } from '../types/account';
import { CloudEndpoint, CloudResponse } from './definitions';
import { GetInventoryParameters, SendItemParameters } from '../types/items';

type Params = {
	authToken?: string;
	appSecret: string;
	appId: string;
	baseApiEndpoint: string;
	baseTrustholderEndpoint: string;
};

export default class HandCashConnectService {
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

	getRequest<Url extends CloudEndpoint>(
		method: HttpMethod,
		endpoint: Url,
		body: HttpBody = {},
		queryParameters: QueryParams = {}
	): AxiosRequestConfig<CloudResponse[Url]> {
		const timestamp = new Date().toISOString();
		const nonce = nanoid();
		const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
		const encodedEndpoint = HandCashConnectService.getEncodedEndpoint(endpoint, queryParameters);
		const headers: Record<string, string> = {
			'app-id': this.appId,
			'app-secret': this.appSecret,
			'application-name': 'connect-sdk',
		};
		if (this.privateKey) {
			const publicKey = this.privateKey.to_public_key();
			headers['oauth-publickey'] = publicKey.to_hex();
			headers['oauth-timestamp'] = timestamp.toString();
			headers['oauth-nonce'] = nonce;
			headers['oauth-signature'] = HandCashConnectService.getRequestSignature(
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data: serializedBody as any,
			responseType: 'json',
		};
	}

	getTrustholderRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody,
		queryParameters: QueryParams = {}
	): AxiosRequestConfig {
		const encodedEndpoint = HandCashConnectService.getEncodedEndpoint(endpoint, queryParameters);
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
		const signaturePayload = HandCashConnectService.getRequestSignaturePayload(
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

	async getCurrentProfile() {
		const requestParameters = this.getRequest('GET', '/v1/connect/profile/currentUserProfile');
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getPublicProfilesByHandle(handles: string[]) {
		const aliasArray = handles.map((alias, i) => [`aliases[${i}]`, alias]);
		const requestParameters = this.getRequest(
			'GET',
			'/v1/connect/profile/publicUserProfiles',
			{},
			{
				...Object.fromEntries(aliasArray),
			}
		);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getUserPermissions() {
		const requestParameters = this.getRequest('GET', '/v1/connect/profile/permissions');
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getEncryptionKeypair(encryptionPublicKey: string): Promise<EncryptionKeypair> {
		const requestParameters = this.getRequest(
			'GET',
			'/v1/connect/profile/encryptionKeypair',
			{},
			{
				encryptionPublicKey,
			}
		);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async signData(dataSignatureParameters: DataSignatureParameters) {
		const requestParameters = this.getRequest('POST', '/v1/connect/profile/signData', {
			format: dataSignatureParameters.format,
			value: dataSignatureParameters.value,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getUserFriends() {
		const requestParameters = this.getRequest('GET', '/v1/connect/profile/friends');
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getSpendableBalance(currencyCode?: CurrencyCode) {
		const requestParameters = this.getRequest(
			'GET',
			'/v1/connect/wallet/spendableBalance',
			{},
			currencyCode ? { currencyCode } : {}
		);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getTotalBalance() {
		const requestParameters = this.getRequest('GET', '/v1/connect/wallet/balance');
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async pay(paymentParameters: PaymentParameters) {
		const requestParameters = this.getRequest('POST', '/v1/connect/wallet/pay', {
			description: paymentParameters.description,
			appAction: paymentParameters.appAction,
			receivers: paymentParameters.payments,
			attachment: paymentParameters.attachment,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getPayment(transactionId: string) {
		const requestParameters = this.getRequest('GET', '/v1/connect/wallet/payment', {}, { transactionId });
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getExchangeRate(currencyCode: CurrencyCode) {
		const requestParameters = this.getRequest('GET', `/v1/connect/wallet/exchangeRate/${currencyCode}`);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async pursePay(rawTransaction: string, inputParents: unknown[]) {
		const requestParameters = this.getRequest('POST', '/v1/connect/runExtension/purse/pay', {
			rawTransaction,
			inputParents,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async purseBroadcast(rawTransaction: string) {
		const requestParameters = this.getRequest('POST', '/v1/connect/runExtension/purse/broadcast', {
			rawTransaction,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async ownerNextAddress(alias: string) {
		const requestParameters = this.getRequest(
			'GET',
			'/v1/connect/runExtension/owner/next',
			{},
			{
				alias,
			}
		);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async ownerSign(rawTransaction: string, inputParents: unknown[], locks: unknown[]) {
		const requestParameters = this.getRequest('POST', '/v1/connect/runExtension/owner/sign', {
			rawTransaction,
			inputParents,
			locks,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getNftLocations() {
		const requestParameters = this.getRequest('GET', '/v1/connect/runExtension/owner/nftLocations');
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async requestEmailCode(email: string): Promise<string> {
		const requestParameters = this.getRequest('POST', '/v1/connect/account/requestEmailCode', { email });
		return (await HandCashConnectService.handleRequest(requestParameters, new Error().stack)).requestId.requestId;
	}

	async verifyEmailCode(requestId: string, verificationCode: string, publicKey: string) {
		const requestParameters = this.getTrustholderRequest('POST', `/auth/verifyCode`, {
			requestId,
			verificationCode,
			publicKey,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async createNewAccount(accessPublicKey: string, email: string, referrerAlias?: string) {
		const requestParameters = this.getRequest('POST', '/v1/connect/account', {
			accessPublicKey,
			email,
			referrerAlias,
		});
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async getInventory(params: GetInventoryParameters) {
		const requestParameters = this.getRequest('POST', '/v3/wallet/items/inventory', params);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	async sendItems(params: SendItemParameters) {
		const requestParameters = this.getRequest('GET', '/v3/wallet/items/send', params);
		return HandCashConnectService.handleRequest(requestParameters, new Error().stack);
	}

	static async handleRequest<T>(requestParameters: AxiosRequestConfig<T>, stack: string | undefined) {
		try {
			const response = await axios(requestParameters);
			return response.data as T;
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			throw HandCashConnectService.handleApiError({ ...error, stack });
		}
	}

	static handleApiError(result: {
		stack?: string;
		request: { path: string; method: string };
		response?: { status: number; data: { message: string; info: string } };
	}) {
		if (!result.response || !result.response.status) {
			return new Error(JSON.stringify(result));
		}
		return new HandCashConnectApiError({
			method: result.request.method,
			path: result.request.path,
			httpStatusCode: result.response.status,
			message: result.response.data.message,
			info: result.response.data.info,
			stack: result.stack,
		});
	}
}
