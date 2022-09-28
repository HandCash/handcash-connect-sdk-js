const HandCashConnectService = require('./api/handcash_connect_service');
const HttpRequestFactory = require('./api/http_request_factory');
const Wallet = require('./wallet');
const Profile = require('./profile');
const Account = require('./account');

class HandCashCloudAccount {
   constructor(wallet, profile, account) {
      this.wallet = wallet;
      this.profile = profile;
      this.account = account;
   }

   static fromAuthToken(authToken, appSecret, appId, baseEndpoint, baseTrustholderEndpoint) {
      const handCashConnectService = new HandCashConnectService(
         new HttpRequestFactory(
            authToken,
            baseEndpoint,
            baseTrustholderEndpoint,
            appSecret,
            appId
         ),
      );
      const wallet = new Wallet(handCashConnectService);
      const profile = new Profile(handCashConnectService);
      const account = new Account(handCashConnectService);
      return new HandCashCloudAccount(wallet, profile, account);
   }
}

module.exports = HandCashCloudAccount;
