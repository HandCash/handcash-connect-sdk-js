const HandCashCloudAccount = require('./handcash_cloud_account');
const Environments = require('./environments');

class HandCashConnect {
   constructor(params) {
      this.appId = params.appId;
      this.appSecret = params.appSecret;
      this.env = params.env || Environments.prod;
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

   getAccountFromAuthToken(authToken) {
      return HandCashCloudAccount.fromAuthToken(authToken, this.appSecret, this.env.apiEndpoint);
   }
}

module.exports = HandCashConnect;
