import HandCashConnectService from '../api/handcash_connect_service';
import { ExchangeRate, SpendableBalance, UserBalance} from '../types/account';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentParameters, PaymentResult } from '../types/payments';

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
	 * Get the user deposit address for legacy non P2P transactions.
	 *
	 * @returns {Promise<string>} A promise that resolves with the deposit address in base58 format.
	 */
	async getDepositAddress(instrumentCode = 'BSV'): Promise<string> {
		return this.handCashConnectService.getDepositAddress(instrumentCode).then((response) => {
			return response.address;
		});
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
	async getExchangeRate(currencyCode: CurrencyCode): Promise<ExchangeRate> {
		return this.handCashConnectService.getExchangeRate(currencyCode);
	}
}
