import { request } from 'undici';
import { CurrencyCode } from '../types/currencyCode';
import { RequestParams } from '../types/http';
import { PaymentParameters } from '../types/payments';
import { DataSignatureParameters } from '../types/signature';
import HandCashConnectApiError from './handcash_connect_api_error';
import HttpRequestFactory from './http_request_factory';

type EncryptionKeypair = {
	encryptedPublicKeyHex: string;
	encryptedPrivateKeyHex: string;
	senderPublicKeyHex: string;
	receiverPublicKeyHex: string;
};

export default class HandCashConnectService {
	httpRequestFactory: HttpRequestFactory;

	constructor(httpRequestFactory: HttpRequestFactory) {
		this.httpRequestFactory = httpRequestFactory;
	}

	async getCurrentProfile() {
		const requestParameters = this.httpRequestFactory.getCurrentProfileRequest();
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getPublicProfilesByHandle(handles: string[]) {
		const requestParameters = this.httpRequestFactory.getPublicProfilesByHandleRequest(handles);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getUserPermissions() {
		const requestParameters = this.httpRequestFactory.getUserPermissionsRequest();
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getEncryptionKeypair(encryptionPublicKey: string): Promise<EncryptionKeypair> {
		const requestParameters = this.httpRequestFactory.getEncryptionKeypairRequest(encryptionPublicKey);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async signData(dataSignatureParameters: DataSignatureParameters) {
		const requestParameters = this.httpRequestFactory.getDataSignatureRequest(dataSignatureParameters);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getUserFriends() {
		const requestParameters = this.httpRequestFactory.getUserFriendsRequest();
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getSpendableBalance(currencyCode?: CurrencyCode) {
		const requestParameters = this.httpRequestFactory.getSpendableBalanceRequest(currencyCode);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getTotalBalance() {
		const requestParameters = this.httpRequestFactory.getTotalBalanceRequest();
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async pay(paymentParameters: PaymentParameters) {
		const requestParameters = this.httpRequestFactory.getPayRequest(paymentParameters);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getPayment(transactionId: string) {
		const requestParameters = this.httpRequestFactory.getPaymentRequest({ transactionId });
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getExchangeRate(currencyCode: CurrencyCode) {
		const requestParameters = this.httpRequestFactory.getExchangeRateRequest(currencyCode);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async pursePay(rawTransaction: string, parents: unknown[]) {
		const requestParameters = this.httpRequestFactory.getPursePayRequest(rawTransaction, parents);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async purseBroadcast(rawTransaction: string) {
		const requestParameters = this.httpRequestFactory.getPurseBroadcastRequest(rawTransaction);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async ownerNextAddress(alias: string) {
		const requestParameters = this.httpRequestFactory.getOwnerNextAddressRequest(alias);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async ownerSign(rawTransaction: string, inputParents: unknown[], locks: unknown[]) {
		const requestParameters = this.httpRequestFactory.getOwnerSignRequest(rawTransaction, inputParents, locks);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async getNftLocations() {
		const requestParameters = this.httpRequestFactory.getNftLocationsRequest();
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async requestEmailCode(email: string): Promise<string> {
		const requestParameters = this.httpRequestFactory.requestEmailCodeRequest(email);
		return (await HandCashConnectService.handleRequest(requestParameters)).requestId.requestId;
	}

	async verifyEmailCode(requestId: string, verificationCode: string, publicKey: string) {
		const requestParameters = this.httpRequestFactory.verifyEmailCodeRequest(
			requestId,
			verificationCode,
			publicKey
		);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async createNewAccount(accessPublicKey: string, email: string, referrerAlias?: string) {
		const requestParameters = this.httpRequestFactory.createNewAccountRequest(
			accessPublicKey,
			email,
			referrerAlias
		);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	static async handleRequest(requestParameters: [string, RequestParams]) {
		const { body, statusCode } = await request(requestParameters[0], requestParameters[1]);
		const data = await body.json();
		if ('message' in data && 'info' in data) {
			return HandCashConnectService.handleApiError(statusCode, data);
		}
		return data;
	}

	static handleApiError(statusCode: number, errorResponse: { message: string; info?: object }) {
		return new HandCashConnectApiError(statusCode, errorResponse.message, JSON.stringify(errorResponse.info));
	}
}
