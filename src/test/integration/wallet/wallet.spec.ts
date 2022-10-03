import { describe, expect, it } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { PaymentParameters } from '../../../types/payments';
import { authToken, handcashAppSecret } from '../../env';
import createPaymentResultApiDefinition from './createPaymentResult.api-definition';
import exchangeRateApiDefinition from './exchangeRate.api-definition';
import paymentResultApiDefinition from './paymentResult.api-definition';
import spendableBalanceApiDefinition from './spendableBalance.api-definition';

describe('# Wallet - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: 'appId',
		appSecret: handcashAppSecret,
		env: Environments.iae,
	}).getAccountFromAuthToken(authToken);
	it('should pay to multiple people using handles, paymails and attaching data', async () => {
		const paymentParameters: PaymentParameters = {
			description: 'Testing Connect SDK',
			appAction: 'test',
			payments: [
				{
					destination: 'apagut',
					currencyCode: 'USD',
					sendAmount: 0.005,
				},
				{
					destination: 'rjseibane@handcash.io',
					currencyCode: 'EUR',
					sendAmount: 0.005,
				},
			],
			attachment: {
				format: 'hex',
				value: '0011223344556677889900AABBCCDDEEFF',
			},
		};
		const createPaymentResult = await cloudAccount.wallet.pay(paymentParameters);
		expect(createPaymentResultApiDefinition).toMatchObject(createPaymentResult);
	});
	it('should retrieve a previous payment result', async () => {
		const transactionId = 'c10ae3048927ba7f18864c2849d7e718899a1ba8f9aef3475b0b7453539d2ff6';
		const paymentResult = await cloudAccount.wallet.getPayment(transactionId);
		expect(paymentResultApiDefinition).toMatchObject(paymentResult);
	});
	it('should get spendable balance in default currency', async () => {
		const spendableBalance = await cloudAccount.wallet.getSpendableBalance();
		expect(spendableBalanceApiDefinition).toMatchObject(spendableBalance);
	});
	it('should get spendable balance in EUR', async () => {
		const spendableBalance = await cloudAccount.wallet.getSpendableBalance('EUR');
		expect(spendableBalanceApiDefinition).toMatchObject(spendableBalance);
		expect(spendableBalance.currencyCode).toBe('EUR');
	});
	it('should get total balance', async () => {
		const totalBalance = await cloudAccount.wallet.getTotalBalance();
		expect(totalBalance.currencyCode).toBeTypeOf('string');
		expect(totalBalance.fiatBalance).toBeGreaterThan(0);
		expect(totalBalance.satoshiBalance).toBeGreaterThan(0);
	});
	it('should get exchange rate in EUR', async () => {
		const exchangeRate = await cloudAccount.wallet.getExchangeRate('EUR');
		expect(exchangeRateApiDefinition).toMatchObject(exchangeRate);
		expect(exchangeRate.fiatSymbol).toBe('EUR');
	});
});
