const HandCashConnectService = require('../api/handcash_connect_service');
const HttpRequestFactory = require('../api/http_request_factory');
const Environments = require('../environments');

module.exports = class HandCashOwner {
   constructor(handCashConnectService) {
      this.handCashConnectService = handCashConnectService;
   }

   static fromAuthToken(authToken,
      /* istanbul ignore next */ env = Environments.prod,
      /* istanbul ignore next */ appSecret = '') {
      const handCashConnectService = new HandCashConnectService(
         new HttpRequestFactory(
            authToken,
            env.apiEndpoint,
            appSecret,
         ),
      );
      return new HandCashOwner(handCashConnectService);
   }

   async nextOwner(alias) {
      const res = await this.handCashConnectService.ownerNextAddress(alias);
      return res.ownerAddress;
   }

   async sign(rawTransaction, inputParents, locks) {
      const res = await this.handCashConnectService.ownerSign(rawTransaction, inputParents, locks);
      return res.signedTransaction;
   }

   async getNftLocations() {
      const res = await this.handCashConnectService.getNftLocations();
      return res.nftLocations;
   }
};
