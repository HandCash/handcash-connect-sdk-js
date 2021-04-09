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
      this.cloudAccount = new HandCashConnect('appId', Environments.iae).getAccountFromAuthToken(authToken);
   });

   it('should pay to multiple people using handles, paymails and attaching data', async () => {
      const paymentParameters = {
         description: 'Testing Connect SDK',
         appAction: 'test',
         payments: [
            {
               to: 'rjseibane',
               currencyCode: 'USD',
               amount: 0.005,
            },
            {
               to: 'rjseibane@handcash.io',
               currencyCode: 'EUR',
               amount: 0.005,
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
               to: 'nosetwo',
               amount: 0.005,
            },
         ],
         attachment: {
            format: 'hex',
            value: '0011223344556677889900AABBCCDDEEFF',
         },
      };

      const error = this.cloudAccount.wallet.pay(paymentParameters);

      expect(error)
         .to
         .eventually
         .be
         .rejectedWith(HandCashConnectApiError);
   });

   it('should retrieve a previous payment result', async () => {
      const transactionId = 'c6c782d3af0cf794e963bea40047ce5c65f89ceb22963f279ee215e30bb76db3';
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
      expect(spendableBalance.currencyCode)
         .to
         .equal('EUR');
   });

   it('should get exchange rate in EUR', async () => {
      const exchangeRate = await this.cloudAccount.wallet.getExchangeRate('EUR');

      expect.definitionToMatch(exchangeRateApiDefinition, exchangeRate);
      expect(exchangeRate.fiatSymbol)
         .to
         .equal('EUR');
   });
});
