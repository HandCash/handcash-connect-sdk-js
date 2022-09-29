const { PrivateKey, PublicKey } = require('bsv');
const HandCashCloudAccount = require('./handcash_cloud_account');
const Environments = require('./environments');
const HandCashConnectService = require('./api/handcash_connect_service');
const HttpRequestFactory = require('./api/http_request_factory');

class HandCashConnect {
   constructor({ appId, appSecret, env = Environments.prod }) {
      this.appId = appId;
      this.appSecret = appSecret;
      /* istanbul ignore next */ this.env = env || Environments.prod;
      this.handCashConnectService = new HandCashConnectService(
         new HttpRequestFactory({
            appId: this.appId,
            appSecret: this.appSecret,
            baseApiEndpoint: this.env.apiEndpoint,
            baseTrustholderEndpoint: this.env.trustholderEndpoint,
         }),
      )
   }

   getRedirectionUrl(queryParameters = {}) {
      queryParameters.appId = this.appId;
      const encodedParams = Object.entries(queryParameters)
         .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val.toString())}`)
         .join('&');
      return `${this.env.clientUrl}/#/authorizeApp?${encodedParams}`;
   }

   getChangeSpendLimitsUrl(redirectUrl = false) {
      const url = `${this.env.clientUrl}/#/settings/spendLimits`;
      return url + (redirectUrl ? `?redirectUrl=${redirectUrl}` : '');
   }

   generateAuthenticationKeyPair = () => {
      const privateKey = PrivateKey.fromRandom();
      const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
      return {
         privateKey: privateKey.toHex(),
         publicKey: publicKey.toHex(),
      };
   };

   requestEmailCode(email) {
      return this.handCashConnectService.requestEmailCode(email);
   }

   verifyEmailCode(requestId, verificationCode, accessPublicKey) {
      return this.handCashConnectService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
   }

   createNewAccount(accessPublicKey, email, referrerAlias) {
      return this.handCashConnectService.createNewAccount(accessPublicKey, email, referrerAlias);
   }

   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount
         .fromAuthToken(authToken, this.appSecret, this.appId, this.env.apiEndpoint, this.env.trustholderEndpoint);
   }
}

module.exports = HandCashConnect;
