import HandCashConnectService from '../api/handcash_connect_service';
import { ExchangeRate, SpendableBalance, UserBalance } from '../types/account';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters, PaymentResult } from '../types/payments';

export default class Wallet {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	async getSpendableBalance(currencyCode?: CurrencyCode): Promise<SpendableBalance> {
		return this.handCashConnectService.getSpendableBalance(currencyCode);
	}

	async getTotalBalance(): Promise<UserBalance> {
		return this.handCashConnectService.getTotalBalance();
	}

	async pay(paymentParameters: PaymentParameters): Promise<PaymentResult> {
		return this.handCashConnectService.pay(paymentParameters);
	}

	async getPayment(transactionId: string): Promise<PaymentResult> {
		return this.handCashConnectService.getPayment(transactionId);
	}

	async getExchangeRate(currencyCode: CurrencyCode): Promise<ExchangeRate> {
		return this.handCashConnectService.getExchangeRate(currencyCode);
	}
}
