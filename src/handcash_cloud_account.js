const HandCashConnectService = require('./api/handcash_connect_service');
const HttpRequestFactory = require('./api/http_request_factory');
const Wallet = require('./wallet');
const Profile = require('./profile');

module.exports = class HandCashCloudAccount {
   /**
    * @param {Wallet} wallet
    * @param {Profile} profile
    */
   constructor(wallet, profile) {
      this.wallet = wallet;
      this.profile = profile;
   }

   /**
    * @param {string} authToken
    * @param {string} baseEndpoint
    * @returns {HandCashCloudAccount}
    */
   static fromAuthToken(authToken, baseEndpoint) {
      const handCashConnectService = new HandCashConnectService(
         new HttpRequestFactory(
            authToken,
            baseEndpoint,
         ),
      );
      const wallet = new Wallet(handCashConnectService);
      const profile = new Profile(handCashConnectService);
      return new HandCashCloudAccount(wallet, profile);
   }
};
