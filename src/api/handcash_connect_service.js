const axios = require('axios');
const HandCashConnectApiError = require('./handcash_connect_api_error');

class HandCashConnectService {
   constructor(httpRequestFactory) {
      this.httpRequestFactory = httpRequestFactory;
   }

   async getCurrentProfile() {
      const requestParameters = this.httpRequestFactory.getCurrentProfileRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getPublicProfilesByHandle(handles) {
      const requestParameters = this.httpRequestFactory.getPublicProfilesByHandleRequest(handles);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getUserPermissions() {
      const requestParameters = this.httpRequestFactory.getUserPermissionsRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getEncryptionKeypair(encryptionPublicKey) {
      const requestParameters = this.httpRequestFactory.getEncryptionKeypairRequest(
         encryptionPublicKey,
      );
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async signData(dataSignatureParameters) {
      const requestParameters = this.httpRequestFactory.getDataSignatureRequest(dataSignatureParameters);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getUserFriends() {
      const requestParameters = this.httpRequestFactory.getUserFriendsRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getSpendableBalance(currencyCode) {
      const requestParameters = this.httpRequestFactory.getSpendableBalanceRequest(currencyCode);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getTotalBalance() {
      const requestParameters = this.httpRequestFactory.getTotalBalanceRequest();
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async pay(paymentParameters) {
      const requestParameters = this.httpRequestFactory.getPayRequest(paymentParameters);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getPayment(transactionId) {
      const requestParameters = this.httpRequestFactory.getPaymentRequest({ transactionId });
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getExchangeRate(currencyCode) {
      const requestParameters = this.httpRequestFactory.getExchangeRateRequest(currencyCode);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async pursePay(rawTransaction, parents) {
      const requestParameters = this.httpRequestFactory.getPursePayRequest(rawTransaction, parents);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async purseBroadcast(rawTransaction) {
      const requestParameters = this.httpRequestFactory.getPurseBroadcastRequest(rawTransaction);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async ownerNextAddress(alias) {
      const requestParameters = this.httpRequestFactory.getOwnerNextAddressRequest(alias);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async ownerSign(rawTransaction, inputParents, locks) {
      const requestParameters = this.httpRequestFactory.getOwnerSignRequest(rawTransaction, inputParents, locks);
      return HandCashConnectService.handleRequest(requestParameters);
   }

   async getNftLocations() {
      const requestParameters = this.httpRequestFactory.getNftLocationsRequest();
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
