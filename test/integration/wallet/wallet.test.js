const chai = require('../../chai_extensions');
const paymentResultApiDefinition = require('./paymentResult.api-definition');
const createPaymentResultApiDefinition = require('./createPaymentResult.api-definition');
const spendableBalanceApiDefinition = require('./spendableBalance.api-definition');
const exchangeRateApiDefinition = require('./exchangeRate.api-definition');

const { HandCashConnect, HandCashConnectApiError, Environments } = require('../../../src/index');

const { expect } = chai;

describe('# Wallet - Integration Tests', () => {
	before(async () => {
		const authToken = process.env.test_authToken;
		const appSecret = process.env.app_secret;
		this.cloudAccount = new HandCashConnect({
			appId: 'appId',
			appSecret,
			env: Environments.iae,
		}).getAccountFromAuthToken(authToken);
	});

	it('should pay to multiple people using handles, paymails and attaching data', async () => {
		const paymentParameters = {
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

		const createPaymentResult = await this.cloudAccount.wallet.pay(paymentParameters);
		expect.definitionToMatch(createPaymentResultApiDefinition, createPaymentResult);
	});

	it('should reject a payment with missing parameters', async () => {
		const paymentParameters = {
			description: 'Testing Connect SDK',
			appAction: 'test',
			payments: [
				{
					destination: 'nosetwo',
					sendAmount: 0.005,
				},
			],
			attachment: {
				format: 'hex',
				value: '0011223344556677889900AABBCCDDEEFF',
			},
		};

		const error = this.cloudAccount.wallet.pay(paymentParameters);

		return expect(error).to.eventually.be.rejectedWith(HandCashConnectApiError);
	});

	it('should retrieve a previous payment result', async () => {
		const transactionId = 'c10ae3048927ba7f18864c2849d7e718899a1ba8f9aef3475b0b7453539d2ff6';
		const paymentResult = await this.cloudAccount.wallet.getPayment(transactionId);

		expect.definitionToMatch(paymentResultApiDefinition, paymentResult);
	});

	it('should get spendable balance in default currency', async () => {
		const spendableBalance = await this.cloudAccount.wallet.getSpendableBalance();

		expect.definitionToMatch(spendableBalanceApiDefinition, spendableBalance);
	});

	it('should get spendable balance in EUR', async () => {
		const spendableBalance = await this.cloudAccount.wallet.getSpendableBalance('EUR');

		expect.definitionToMatch(spendableBalanceApiDefinition, spendableBalance);
		expect(spendableBalance.currencyCode).to.equal('EUR');
	});

	it('should get total balance', async () => {
		const totalBalance = await this.cloudAccount.wallet.getTotalBalance();

		expect(totalBalance.fiatCurrencyCode).to.be.a('string');
		expect(totalBalance.fiatBalance).to.be.greaterThan(0);
		expect(totalBalance.satoshiBalance).to.be.greaterThan(0);
	});

	it('should get exchange rate in EUR', async () => {
		const exchangeRate = await this.cloudAccount.wallet.getExchangeRate('EUR');

		expect.definitionToMatch(exchangeRateApiDefinition, exchangeRate);
		expect(exchangeRate.fiatSymbol).to.equal('EUR');
	});
});
