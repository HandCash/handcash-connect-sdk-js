import { describe, expect, it } from 'vitest';
import Environments from '../../../environments';
import HandCashConnect from '../../../handcash_connect';
import { PaymentParameters } from '../../../types/payments';
import { authToken, handcashAppSecret, handcashAppId } from '../../env';

describe('# Wallet - Integration Tests', () => {
	const cloudAccount = new HandCashConnect({
		appId: handcashAppId,
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
					sendAmount: 0.0001,
				},
				{
					destination: 'rjseibane@handcash.io',
					currencyCode: 'EUR',
					sendAmount: 0.0001,
				},
			],
			attachment: {
				format: 'hex',
				value: '0011223344556677889900AABBCCDDEEFF',
			},
		};
		const createdPaymentResult = await cloudAccount.wallet.pay(paymentParameters);
		expect(createdPaymentResult.transactionId).toBeTypeOf('string');
		const particpantAliases = createdPaymentResult.participants.map((p) => p.alias);
		expect(particpantAliases).toContain('rjseibane@handcash.io');
		expect(particpantAliases).toContain('apagut');
	});

	it('should throw an error when using invalid parameters', async () => {
		const paymentParameters: PaymentParameters = {
			description: 'Testing Connect SDK',
			payments: [
				{
					destination: '',
					currencyCode: 'USD',
					sendAmount: 0.0001,
				},
			],
		};
		await expect(cloudAccount.wallet.pay(paymentParameters)).rejects.toThrow(
			'"receivers[0].destination" is not allowed to be empty'
		);
	});

	it('should retrieve a previous payment result', async () => {
		const transactionId = 'c10ae3048927ba7f18864c2849d7e718899a1ba8f9aef3475b0b7453539d2ff6';
		const paymentResult = await cloudAccount.wallet.getPayment(transactionId);
		expect(paymentResult.transactionId).toBe(transactionId);
	});

	it('should get deposit address using the default instrument code', async () => {
		const address = await cloudAccount.wallet.getDepositAddress();
		expect(address).toBeTypeOf('string');
		expect(address).toHaveLength(34);
	});

	it('should get spendable balance in default currency', async () => {
		const spendableBalance = await cloudAccount.wallet.getSpendableBalance();
		expect(spendableBalance.currencyCode).toBeTypeOf('string');
		expect(spendableBalance.spendableFiatBalance).toBeGreaterThan(0);
		expect(spendableBalance.spendableSatoshiBalance).toBeGreaterThan(0);
	});

	it('should get spendable balance in EUR', async () => {
		const spendableBalance = await cloudAccount.wallet.getSpendableBalance('EUR');
		expect(spendableBalance.currencyCode).toBe('EUR');
		expect(spendableBalance.spendableSatoshiBalance).toBeGreaterThan(0);
		expect(spendableBalance.spendableSatoshiBalance).toBeGreaterThan(0);
	});

	it('should get total balance', async () => {
		const totalBalance = await cloudAccount.wallet.getTotalBalance();
		expect(totalBalance.fiatCurrencyCode).toBeTypeOf('string');
		expect(totalBalance.fiatBalance).toBeGreaterThan(0);
		expect(totalBalance.satoshiBalance).toBeGreaterThan(0);
	});

	it('should get exchange rate in EUR', async () => {
		const exchangeRate = await cloudAccount.wallet.getExchangeRate('EUR');
		expect(exchangeRate.fiatSymbol).toBe('EUR');
		expect(exchangeRate.rate).toBeGreaterThan(0);
	});
});
