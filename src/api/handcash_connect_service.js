const axios = require('axios');
// eslint-disable-next-line no-unused-vars
const HttpRequestFactory = require('./http_request_factory');
const HandCashConnectApiError = require('./handcash_connect_api_error');

module.exports = class HandCashConnectService {
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

   static async handleRequest(requestParameters) {
      return axios(requestParameters)
         .then(response => response.data)
         .catch(HandCashConnectService.handleApiError);
   }

   static handleApiError(errorResponse) {
      if (!errorResponse.response || !errorResponse.response.statusCode) {
         return Promise.reject(errorResponse);
      }
      return Promise.reject(new HandCashConnectApiError(
         errorResponse.response.statusCode,
         errorResponse.response.data.message,
         errorResponse.response.data.info,
      ));
   }
};
