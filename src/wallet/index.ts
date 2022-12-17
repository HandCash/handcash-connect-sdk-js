import HandCashConnectService from '../api/handcash_connect_service';
import { ExchangeRate, SpendableBalance, UserBalance } from '../types/account';
import { PaymentParameters, PaymentResult } from '../types/payments';
import { FiatCurrencyCode } from '../types/fiatCurrencyCode';
import { CurrencyCode } from '../types/currencyCode';
import { BlockchainCode } from '../types/blockchainCode';

export default class Wallet {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 * Checks the user's spendable balances.
	 * See {@link https://docs.handcash.io/docs/check-balance} for more information.
	 *
	 *
	 * @returns {Promise<[SpendableBalance]>} A promise that resolves with the spendable balances.
	 */
	async getSpendableBalances(): Promise<[SpendableBalance]> {
		return this.handCashConnectService.getSpendableBalances().then((result) => result.items);
	}

	/**
	 * Get the user's total balances.
	 *
	 * @returns {Promise<UserBalance[]>} A promise that resolves with the user balances.
	 */
	async getTotalBalances(): Promise<UserBalance[]> {
		return this.handCashConnectService.getTotalBalance().then((result) => result.items);
	}

	/**
	 * Get the user's deposit address for the given currency code.
	 *
	 * @param {CurrencyCode} currencyCode - The currency code.
	 * @param {BlockchainCode} blockchainCode? - The blockchain code in case of USDC.
	 *
	 * @returns {Promise<UserBalance[]>} A promise that resolves with the user deposit address
	 */
	async getDepositAddress(currencyCode: CurrencyCode, blockchainCode?: BlockchainCode): Promise<UserBalance[]> {
		const result = await this.handCashConnectService.getDepositAddress(currencyCode, blockchainCode);
		return result.address;
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
	async getExchangeRate(currencyCode: FiatCurrencyCode): Promise<ExchangeRate> {
		return this.handCashConnectService.getExchangeRate(currencyCode);
	}
}
