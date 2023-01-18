import axios, { AxiosRequestConfig } from 'axios';
import { TxInput, TxLock } from '../types/bsv';
import { CurrencyCode } from '../types/currencyCode';
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

	async pursePay(rawTransaction: string, parents: TxInput[]) {
		const requestParameters = this.httpRequestFactory.getPursePayRequest(rawTransaction, parents);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async purseBroadcast(rawTransaction: string) {
		const requestParameters = this.httpRequestFactory.getPurseBroadcastRequest(rawTransaction);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async ownerNextAddress(alias?: string) {
		const requestParameters = this.httpRequestFactory.getOwnerNextAddressRequest(alias);
		return HandCashConnectService.handleRequest(requestParameters);
	}

	async ownerSign(rawTransaction: string, inputParents: TxInput[], locks: TxLock[]) {
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

	static async handleRequest(requestParameters: AxiosRequestConfig) {
		return axios(requestParameters)
			.then((response) => response.data)
			.catch(HandCashConnectService.handleApiError);
	}

	static handleApiError(errorResponse: { response?: { status: number; data: { message: string; info: string } } }) {
		if (!errorResponse.response || !errorResponse.response.status) {
			return Promise.reject(errorResponse);
		}
		return Promise.reject(
			new HandCashConnectApiError(
				errorResponse.response.status,
				errorResponse.response.data.message,
				errorResponse.response.data.info
			)
		);
	}
}
