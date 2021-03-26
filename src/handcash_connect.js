const HandCashCloudAccount = require('./handcash_cloud_account');
const Environments = require('./environments');

module.exports = class HandCashConnect {
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
    * @param {String} authToken
    * @returns {HandCashCloudAccount}
    */
   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount.fromAuthToken(authToken, this.env.apiEndpoint);
   }
};
