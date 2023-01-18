import { z } from 'zod';
import HandCashConnectService from '../api/handcash_connect_service';
import { ExchangeRate, SpendableBalance, UserBalance } from '../types/account';
import { CurrencyCode, CurrencyCodeZ } from '../types/currencyCode';
import { PaymentParameters, PaymentParametersZ, PaymentResult } from '../types/payments';

export default class Wallet {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 * Checks the user's spendable balance.
	 * See {@link https://docs.handcash.io/docs/check-balance} for more information.
	 *
	 * @param {string} currencyCode - The currency code.
	 * See the list of supported currencies here: {@link https://docs.handcash.io/docs/supported-currencies}.
	 *
	 * @returns {Promise<SpendableBalance>} A promise that resolves with the spendable balance.
	 */
	async getSpendableBalance(currencyCode?: CurrencyCode): Promise<SpendableBalance> {
		try {
			CurrencyCodeZ.optional().parse(currencyCode);
		} catch (err) {
			throw new Error('Your currency code is not supported. Check the documentation.');
		}

		return this.handCashConnectService.getSpendableBalance(currencyCode);
	}

	/**
	 * Get the user's total satoshi & fiat balance.
	 *
	 * @returns {Promise<UserBalance>} A promise that resolves with the user balance.
	 */
	async getTotalBalance(): Promise<UserBalance> {
		return this.handCashConnectService.getTotalBalance();
	}

	/**
	 *
	 * Make a payment for your user.
	 * See {@link https://docs.handcash.io/docs/make-a-payment} for more information.
	 *
	 * @param {object} paymentParameters - The payment parameters.
	 *
	 * @returns {Promise<PaymentResult>} A promise that resolves with the payment result.
	 */
	async pay(paymentParameters: PaymentParameters): Promise<PaymentResult> {
		try {
			PaymentParametersZ.parse(paymentParameters);
		} catch (err) {
			throw new Error('Your payment parameters are not valid. Check the documentation.');
		}

		return this.handCashConnectService.pay(paymentParameters);
	}

	/**
	 * Fetch information about one of your payments using the transaction id as reference.
	 *
	 * @param {string} transactionId - The transaction id.
	 *
	 * @returns {Promise<PaymentResult>} A promise that resolves with the payment result.
	 *
	 */
	async getPayment(transactionId: string): Promise<PaymentResult> {
		try {
			z.string().parse(transactionId);
		} catch (err) {
			throw new Error('transactionId must be a valid string.');
		}

		return this.handCashConnectService.getPayment(transactionId);
	}

	/**
	 * Fetch the exchange rate for a given currency.
	 *
	 * @param {string} currencyCode - The currency code.
	 * See the list of supported currencies here: {@link https://docs.handcash.io/docs/supported-currencies}.
	 *
	 * @returns {Promise<ExchangeRate>} A promise that resolves with the exchange rate.
	 *
	 */
	async getExchangeRate(currencyCode: CurrencyCode): Promise<ExchangeRate> {
		try {
			CurrencyCodeZ.parse(currencyCode);
		} catch (err) {
			throw new Error('Your currency code is not supported. Check the documentation.');
		}

		return this.handCashConnectService.getExchangeRate(currencyCode);
	}
}
