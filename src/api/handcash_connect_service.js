const axios = require('axios');
const HandCashConnectApiError = require('./handcash_connect_api_error');

/**
 * @class
 */
class HandCashConnectService {
   /**
    * @param {HttpRequestFactory} httpRequestFactory
    */
   constructor(httpRequestFactory) {
      this.httpRequestFactory = httpRequestFactory;
   }

   /**
    * @returns {Promise<UserProfile>}
    */
   async getCurrentProfile() {
      const requestParameters = this.httpRequestFactory.getCurrentProfileRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {Array<String>} handles
    * @returns {Promise<Object>}
    */
   async getPublicProfilesByHandle(handles) {
      const requestParameters = this.httpRequestFactory.getPublicProfilesByHandleRequest(handles);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @returns {Promise<Object>}
    */
   async getUserPermissions() {
      const requestParameters = this.httpRequestFactory.getUserPermissionsRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} encryptionPublicKey
    * @returns {Promise<Object>}
    */
   async getEncryptionKeypair(encryptionPublicKey) {
      const requestParameters = this.httpRequestFactory.getEncryptionKeypairRequest(
         encryptionPublicKey,
      );
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {Object} dataSignatureParameters
    * @returns {Promise<any>}
    */
   async signData(dataSignatureParameters) {
      const requestParameters = this.httpRequestFactory.getDataSignatureRequest(dataSignatureParameters);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @returns {Promise<Object>}
    */
   async getUserFriends() {
      const requestParameters = this.httpRequestFactory.getUserFriendsRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} currencyCode
    * @returns {Promise<SpendableBalance>}
    */
   async getSpendableBalance(currencyCode) {
      const requestParameters = this.httpRequestFactory.getSpendableBalanceRequest(currencyCode);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {Object} paymentParameters
    * @returns {Promise<any>}
    */
   async pay(paymentParameters) {
      const requestParameters = this.httpRequestFactory.getPayRequest(paymentParameters);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} transactionId
    * @returns {Promise<any>}
    */
   async getPayment(transactionId) {
      const requestParameters = this.httpRequestFactory.getPaymentRequest({ transactionId });
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} currencyCode
    * @returns {Promise<any>}
    */
   async getExchangeRate(currencyCode) {
      const requestParameters = this.httpRequestFactory.getExchangeRateRequest(currencyCode);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} rawTransaction
    * @param {Array} parents
    * @returns {Promise<any>}
    */
   async pursePay(rawTransaction, parents) {
      const requestParameters = this.httpRequestFactory.getPursePayRequest(rawTransaction, parents);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {String} rawTransaction
    * @returns {Promise<any>}
    */
   async purseBroadcast(rawTransaction) {
      const requestParameters = this.httpRequestFactory.getPurseBroadcastRequest(rawTransaction);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {string} alias
    * @returns {Promise<any>}
    */
   async ownerNextAddress(alias) {
      const requestParameters = this.httpRequestFactory.getOwnerNextAddressRequest(alias);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   /**
    * @param {string} rawTransaction
    * @param {Array<Object>} inputParents
    * @param {Array<Object>} locks
    * @returns {Promise<any>}
    */
   async ownerSign(rawTransaction, inputParents, locks) {
      const requestParameters = this.httpRequestFactory.getOwnerSignRequest(rawTransaction, inputParents, locks);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   static async handleRequest(requestParameters) {
      return axios(requestParameters)
         .then(response => response.data)
         .catch(HandCashConnectService.handleApiError);
   }

   static handleApiError(errorResponse) {
      if (!errorResponse.response || !errorResponse.response.status) {
         return Promise.reject(errorResponse);
      }
      return Promise.reject(new HandCashConnectApiError(
         errorResponse.response.status,
         errorResponse.response.data.message,
         errorResponse.response.data.info,
      ));
   }
}

module.exports = HandCashConnectService;
