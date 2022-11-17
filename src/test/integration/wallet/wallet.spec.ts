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

	it('should pay to multiple people using BSV with handles, paymails and attaching data', async () => {
		const paymentParameters: PaymentParameters = {
			note: 'Testing Connect SDK',
			currencyCode: 'BSV',
			receivers: [
				{
					destination: 'apagut',
					amount: 0.0000005,
				},
				{
					destination: 'rjseibane@handcash.io',
					amount: 0.0000005,
				},
			],
			attachment: {
				format: 'hex',
				value: '0011223344556677889900AABBCCDDEEFF',
			},
		};
		const createdPaymentResult = await cloudAccount.wallet.pay(paymentParameters);
		expect(createdPaymentResult.transactionId).toBeTypeOf('string');
		expect(createdPaymentResult.participants.map((p) => p.alias)).to.containSubset([
			'apagut',
			'rjseibane@handcash.io',
		]);
	});

	it('should pay to one user using handles and USDC', async () => {
		const paymentParameters: PaymentParameters = {
			note: 'Testing Connect SDK',
			currencyCode: 'MUSDC',
			receivers: [
				{
					destination: 'apagut',
					amount: 0.005,
				},
				{
					destination: 'rafa',
					amount: 0.005,
				},
			],
		};
		const createdPaymentResult = await cloudAccount.wallet.pay(paymentParameters);
		expect(createdPaymentResult.transactionId).toBeTypeOf('string');
		expect(createdPaymentResult.participants.map(p => p.alias)).to.containSubset(['apagut', 'rafa']);
	});

	it('should retrieve a previous payment result', async () => {
		const transactionId = 'c10ae3048927ba7f18864c2849d7e718899a1ba8f9aef3475b0b7453539d2ff6';
		const paymentResult = await cloudAccount.wallet.getPayment(transactionId);
		expect(paymentResult.transactionId).to.eq(transactionId);
	});

	it('should get spendable balances', async () => {
		const spendableBalances = await cloudAccount.wallet.getSpendableBalances();
		expect(spendableBalances[0].currencyCode).toBeTypeOf('string');
		expect(spendableBalances[0].spendableBalance).toBeGreaterThan(0);
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
