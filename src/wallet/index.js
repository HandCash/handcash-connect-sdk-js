// eslint-disable-next-line no-unused-vars
const HandCashConnectService = require('../api/handcash_connect_service');

/**
 * @typedef {Object} SpendableBalance
 * @property {number} spendableSatoshiBalance
 * @property {number} spendableFiatBalance
 * @property {string} currencyCode - ISO4218: "USD", "EUR", ...
 */

/**
 * @typedef {Object} PaymentRequestItem
 * @property {string} destination
 * @property {string} currencyCode
 * @property {number} sendAmount
 */

/**
 * @typedef {Object} TransactionParticipant
 * @property {string} type
 * @property {string} alias
 * @property {number} displayName
 * @property {String} profilePictureUrl
 */

/**
 * @typedef {Object} Attachment
 * @property {string} value
 * @property {string} format - One of "base64", "hex" or "json"
 */

/**
 * @typedef {Object} PaymentResult
 * @property {string} transactionId
 * @property {string} note
 * @property {string} appAction
 * @property {number} time
 * @property {String} type - "send" or "receive"
 * @property {number} satoshiFees
 * @property {number} satoshiAmount
 * @property {number} fiatExchangeRate
 * @property {String} fiatCurrencyCode - ISO4218: "USD", "EUR", ...
 * @property {Array<TransactionParticipant>} participants
 * @property {Array<Attachment>} attachments
 */

/**
 * @typedef {Object} ExchangeRate
 * @property {string} fiatSymbol
 * @property {number} rate
 * @property {number} exchangeRateVersion
 */

module.exports = class Wallet {
   /**
    * @param {HandCashConnectService} handCashConnectService
    */
   constructor(handCashConnectService) {
      this.handCashConnectService = handCashConnectService;
   }

   /**
    * @param {String} currencyCode
    * @returns {Promise<SpendableBalance>}
    */
   async getSpendableBalance(currencyCode) {
      return this.handCashConnectService.getSpendableBalance(currencyCode);
   }

   /**
    * @param {Object} paymentParameters
    * @param {String} paymentParameters.description
    * @param {String} paymentParameters.appAction
    * @param {Array<PaymentRequestItem>} paymentParameters.payments
    * @param {Attachment} paymentParameters.attachment
    * @returns {Promise<PaymentResult>}
    */
   async pay(paymentParameters) {
      return this.handCashConnectService.pay(paymentParameters);
   }

   /**
    * @param {String} transactionId
    * @returns {Promise<PaymentResult>}
    */
   async getPayment(transactionId) {
      return this.handCashConnectService.getPayment(transactionId);
   }

   /**
    * @param {String} currencyCode
    * @returns {Promise<ExchangeRate>}
    */
   async getExchangeRate(currencyCode) {
      return this.handCashConnectService.getExchangeRate(currencyCode);
   }
};
