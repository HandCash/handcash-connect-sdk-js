import { nanoid } from 'nanoid';
import { secp256k1 } from '@noble/curves/secp256k1';
import { createHash } from 'node:crypto';
import { PrivKey } from '@noble/curves/abstract/utils';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters, PaymentResult, DepositAddress } from '../types/payments';
import { DataSignature, DataSignatureParameters } from '../types/signature';
import HandCashConnectApiError from './handcash_connect_api_error';
import { HttpBody, HttpMethod, QueryParams } from '../types/http';
import {
	EncryptionKeypair,
	ExchangeRate,
	PermissionInfo,
	RequestVerificationCode,
	SpendableBalance,
	UserBalance,
	UserProfile,
	UserPublicProfile,
} from '../types/account';
import {
	AddMintOrderItemsParams,
	CreateItemsOrder,
	ItemTransferAndCreateItemsOrder,
	GetItemsFilter,
	ItemTransferResult,
	NewCreateItemsOrder,
	NewBurnAndCreateItemsOrder,
	TransferItemParameters,
	Item,
	Many,
} from '../types/items';

type Params = {
	authToken?: string;
	appSecret: string;
	appId: string;
	baseApiEndpoint: string;
	baseTrustholderEndpoint: string;
};

export default class HandCashConnectService {
	privateKey: PrivKey | undefined;

	appSecret: string;

	appId: string;

	baseApiEndpoint: string;

	baseTrustholderEndpoint: string;

	constructor({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }: Params) {
		if (authToken && !secp256k1.utils.isValidPrivateKey(authToken)) {
			throw Error('Invalid authToken');
		}
		if (!appId) {
			throw Error('Missing appId');
		}
		this.privateKey = authToken;
		this.appSecret = appSecret;
		this.appId = appId;
		this.baseApiEndpoint = baseApiEndpoint;
		this.baseTrustholderEndpoint = baseTrustholderEndpoint;
	}

	getRequest(method: HttpMethod, endpoint: string, body: HttpBody = {}, queryParameters: QueryParams = {}): Request {
		const timestamp = new Date().toISOString();
		const nonce = nanoid();
		const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
		const encodedEndpoint = HandCashConnectService.getEncodedEndpoint(endpoint, queryParameters);
		const headers: Record<string, string> = {
			'app-id': this.appId,
			...(this.appSecret && { 'app-secret': this.appSecret }),
			consumer: 'connect-sdk',
			'content-type': 'application/json',
		};
		if (this.privateKey) {
			const publicKey = secp256k1.getPublicKey(this.privateKey);
			headers['oauth-publickey'] = Buffer.from(publicKey).toString('hex');
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
			url: this.baseApiEndpoint + encodedEndpoint,
			method,
			headers,
			...(method !== 'GET' && { body: serializedBody }),
		} as unknown as Request;
	}

	getTrustholderRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody,
		queryParameters: QueryParams = {}
	): Request {
		const encodedEndpoint = HandCashConnectService.getEncodedEndpoint(endpoint, queryParameters);
		return {
			url: this.baseTrustholderEndpoint + encodedEndpoint,
			method,
			headers: { 'content-type': 'application/json' },
			...(method !== 'GET' && { body: JSON.stringify(body) }),
		} as unknown as Request;
	}

	static getEncodedEndpoint(endpoint: string, queryParameters: QueryParams) {
		const url = new URL(endpoint, 'http://localhost');
		Object.entries(queryParameters).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
		return url.toString().replace('http://localhost', '');
	}

	static getRequestSignature(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		privateKey: PrivKey,
		nonce: string
	): string {
		const signaturePayload = HandCashConnectService.getRequestSignaturePayload(
			method,
			endpoint,
			serializedBody,
			timestamp,
			nonce
		);
		const payloadHash = createHash('sha256').update(signaturePayload).digest('hex');
		return secp256k1.sign(payloadHash, privateKey).toDERHex(true);
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
		return HandCashConnectService.handleRequest<UserProfile>(requestParameters, new Error().stack);
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
		return HandCashConnectService.handleRequest<Many<UserPublicProfile>>(requestParameters, new Error().stack);
	}

	async getUserPermissions() {
		const requestParameters = this.getRequest('GET', '/v1/connect/profile/permissions');
		return HandCashConnectService.handleRequest<PermissionInfo>(requestParameters, new Error().stack);
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
		return HandCashConnectService.handleRequest<DataSignature>(requestParameters, new Error().stack);
	}

	async getUserFriends() {
		const requestParameters = this.getRequest('GET', '/v1/connect/profile/friends');
		return HandCashConnectService.handleRequest<Many<UserPublicProfile>>(requestParameters, new Error().stack);
	}

	async getSpendableBalance(currencyCode?: CurrencyCode) {
		const requestParameters = this.getRequest(
			'GET',
			'/v1/connect/wallet/spendableBalance',
			{},
			currencyCode ? { currencyCode } : {}
		);
		return HandCashConnectService.handleRequest<SpendableBalance>(requestParameters, new Error().stack);
	}

	async getTotalBalance() {
		const requestParameters = this.getRequest('GET', '/v1/connect/wallet/balance');
		return HandCashConnectService.handleRequest<UserBalance>(requestParameters, new Error().stack);
	}

	async getDepositAddress(instrumentCode: string) {
		const requestParameters = this.getRequest('GET', `/v3/wallet/deposit/${instrumentCode}/address`);
		return HandCashConnectService.handleRequest<DepositAddress>(requestParameters, new Error().stack);
	}

	async pay(paymentParameters: PaymentParameters) {
		const requestParameters = this.getRequest('POST', '/v1/connect/wallet/pay', {
			description: paymentParameters.description,
			appAction: paymentParameters.appAction,
			receivers: paymentParameters.payments,
			attachment: paymentParameters.attachment,
		});
		return HandCashConnectService.handleRequest<PaymentResult>(requestParameters, new Error().stack);
	}

	async payPaymentRequest(paymentRequestId: string) {
		const requestParameters = this.getRequest('POST', '/v3/wallet/transactions/send/paymentRequest', {
			paymentRequestId,
		});
		return HandCashConnectService.handleRequest<PaymentResult>(requestParameters, new Error().stack);
	}

	async getPayment(transactionId: string) {
		const requestParameters = this.getRequest('GET', '/v1/connect/wallet/payment', {}, { transactionId });
		return HandCashConnectService.handleRequest<PaymentResult>(requestParameters, new Error().stack);
	}

	async getExchangeRate(currencyCode: CurrencyCode) {
		const requestParameters = this.getRequest('GET', `/v1/connect/wallet/exchangeRate/${currencyCode}`);
		return HandCashConnectService.handleRequest<ExchangeRate>(requestParameters, new Error().stack);
	}

	async pursePay(rawTransaction: string, inputParents: unknown[]) {
		const requestParameters = this.getRequest('POST', '/v1/connect/runExtension/purse/pay', {
			rawTransaction,
			inputParents,
		});
		return HandCashConnectService.handleRequest<{ partiallySignedTx: string }>(
			requestParameters,
			new Error().stack
		);
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
		return HandCashConnectService.handleRequest<{ ownerAddress: string }>(requestParameters, new Error().stack);
	}

	async ownerSign(rawTransaction: string, inputParents: unknown[], locks: unknown[]) {
		const requestParameters = this.getRequest('POST', '/v1/connect/runExtension/owner/sign', {
			rawTransaction,
			inputParents,
			locks,
		});
		return HandCashConnectService.handleRequest<{ signedTransaction: string }>(
			requestParameters,
			new Error().stack
		);
	}

	async getNftLocations() {
		const requestParameters = this.getRequest('GET', '/v1/connect/runExtension/owner/nftLocations');
		return HandCashConnectService.handleRequest<{ nftLocations: string[] }>(requestParameters, new Error().stack);
	}

	async requestEmailCode(email: string, customEmailParameters?: object): Promise<string> {
		const requestParameters = this.getRequest('POST', '/v1/connect/account/requestEmailCode', {
			email,
			customEmailParameters,
		});
		return (
			await HandCashConnectService.handleRequest<RequestVerificationCode>(requestParameters, new Error().stack)
		).requestId.requestId;
	}

	async verifyEmailCode(requestId: string, verificationCode: string, publicKey: string) {
		const requestParameters = this.getTrustholderRequest('POST', `/auth/verifyCode`, {
			requestId,
			verificationCode,
			publicKey,
		});
		return HandCashConnectService.handleRequest<void>(requestParameters, new Error().stack);
	}

	async createNewAccount(accessPublicKey: string, email: string, referrerAlias?: string) {
		const requestParameters = this.getRequest('POST', '/v1/connect/account', {
			accessPublicKey,
			email,
			referrerAlias,
		});
		return HandCashConnectService.handleRequest<UserPublicProfile>(requestParameters, new Error().stack);
	}

	async getItemsInventory(params: GetItemsFilter) {
		const requestParameters = this.getRequest('POST', '/v3/wallet/items/inventory', params);
		return HandCashConnectService.handleRequest<Many<Item>>(requestParameters, new Error().stack);
	}

	async getItemListings(params: GetItemsFilter) {
		const normalizedParams = { ...params, onlyUserListings: true };
		const requestParameters = this.getRequest('POST', '/v3/itemListing/list', normalizedParams);
		return HandCashConnectService.handleRequest<Many<Item>>(requestParameters, new Error().stack);
	}

	async createOrder(params: NewCreateItemsOrder) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder`, params);
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async getCreateItemsOrder(orderId: string) {
		const requestParameters = this.getRequest('GET', `/v3/itemCreationOrder/${orderId}`);
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async getItemsByOrder(orderId: string) {
		const requestParameters = this.getRequest('GET', `/v3/itemCreationOrder/${orderId}/items`);
		return HandCashConnectService.handleRequest<Many<Item>>(requestParameters, new Error().stack);
	}

	async addOrderItems({ orderId, items, itemCreationOrderType }: AddMintOrderItemsParams) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder/${orderId}/add`, {
			items,
			itemCreationOrderType,
		});
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async create(params: NewCreateItemsOrder) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder/issueItems`, params);
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async burnAndCreateItems(params: NewBurnAndCreateItemsOrder) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder/burnAndCreate`, params);
		return HandCashConnectService.handleRequest<ItemTransferAndCreateItemsOrder>(
			requestParameters,
			new Error().stack
		);
	}

	async commitOrder(orderId: string) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder/${orderId}/commit`);
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async inscribeNextBatch(orderId: string) {
		const requestParameters = this.getRequest('POST', `/v3/itemCreationOrder/createBatch`, {
			itemCreationOrderId: orderId,
		});
		return HandCashConnectService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
	}

	async transferItems(params: TransferItemParameters) {
		const requestParameters = this.getRequest('POST', `/v3/wallet/items/send`, params);
		return HandCashConnectService.handleRequest<ItemTransferResult>(requestParameters, new Error().stack);
	}

	async getItemByOrigin(origin: string) {
		const requestParameters = this.getRequest('GET', `/v3/wallet/items/${origin}`);
		return HandCashConnectService.handleRequest<Item>(requestParameters, new Error().stack);
	}

	static async handleRequest<T>(request: Request, stack: string | undefined) {
		const response = await fetch(request.url, request);
		if (response.ok) {
			return (await response.json()) as T;
		}
		throw await HandCashConnectService.handleApiError({ response, request, stack });
	}

	static async handleApiError({
		response,
		request,
		stack,
	}: {
		request: Request;
		response: Response;
		stack: string | undefined;
	}): Promise<Error> {
		let responseData;
		if (response.headers.get('content-type')?.includes('application/json')) {
			try {
				responseData = await response.json();
			} catch (error) {
				responseData = response.bodyUsed ? (error as any).toString() : await response.text();
			}
		}
		responseData ??= response.bodyUsed && (await response.text());
		return new HandCashConnectApiError({
			method: request.method,
			path: request.url,
			httpStatusCode: response.status,
			message: responseData.message ?? responseData,
			info: responseData.info,
			stack,
		});
	}
}
