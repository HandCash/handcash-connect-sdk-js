const HandCashCloudAccount = require('./handcash_cloud_account');
const Environments = require('./environments');

/**
 * @class
 */
class HandCashConnect {
   /**
    * @param {String} appId
    * @param {Environment} [env]
    */
   constructor(appId, env = Environments.prod) {
      this.appId = appId;
      this.env = env;
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
    * @returns {HandCashCloudAccount}
    */
   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount.fromAuthToken(authToken, this.env.apiEndpoint);
   }
}

module.exports = HandCashConnect;
