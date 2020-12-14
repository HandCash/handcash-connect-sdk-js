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
    * @returns {String}
    */
   getRedirectionUrl() {
      return `${this.env.clientUrl}/#/authorizeApp?appId=${this.appId}`;
   }

   /**
    * @param {String} authToken
    * @returns {HandCashCloudAccount}
    */
   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount.fromAuthToken(authToken, this.env.apiEndpoint);
   }
};
