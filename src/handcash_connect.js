const HandCashCloudAccount = require('./handcash_cloud_account');
const Environments = require('./environments');

/**
 * @typedef {Object} HandCashInitParameters
 * @property {String} appId
 * @property {String} appSecret
 * @property {Environment} [env]
 */

/**
 * @class
 */
class HandCashConnect {
   /**
    * @param {HandCashInitParameters} params
    */
   constructor(params) {
      this.appId = params.appId;
      this.appSecret = params.appSecret;
      this.env = params.env || Environments.prod;
   }

   /**
    * @param {object} [queryParameters]
    * @returns {String}
    */
   getRedirectionUrl(queryParameters = {}) {
      queryParameters.appId = this.appId;
      const encodedParams = Object.entries(queryParameters)
         .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val.toString())}`)
         .join('&');
      return `${this.env.clientUrl}/#/authorizeApp?${encodedParams}`;
   }

   /**
    * @returns {String}
    */
   getChangeSpendLimitsUrl(redirectUrl = false) {
      const url = `${this.env.clientUrl}/#/settings/spendLimits`;
      return url + (redirectUrl ? `?redirectUrl=${redirectUrl}` : '');
   }

   /**
    * @param {String} authToken
    * @param {String} authToken
    * @returns {HandCashCloudAccount}
    */
   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount.fromAuthToken(authToken, this.appSecret, this.env.apiEndpoint);
   }
}

module.exports = HandCashConnect;
