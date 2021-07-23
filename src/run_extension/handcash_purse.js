const HandCashConnectService = require('../api/handcash_connect_service');
const HttpRequestFactory = require('../api/http_request_factory');
const Environments = require('../environments');

module.exports = class HandCashPurse {
   /**
    * @param {HandCashConnectService} handCashConnectService
    */
   constructor(handCashConnectService) {
      /**
       * @property {typeof HandCashConnectService}
       */
      this.handCashConnectService = handCashConnectService;
   }

   /**
    * @param {string} authToken
    * @param {Environment} [env]
    * @returns {HandCashPurse}
    */
   static fromAuthToken(authToken, /* istanbul ignore next */ env = Environments.prod) {
      const handCashConnectService = new HandCashConnectService(
         new HttpRequestFactory(
            authToken,
            env.apiEndpoint,
         ),
      );
      return new HandCashPurse(handCashConnectService);
   }

   async pay(rawTx, parents) {
      const res = await this.handCashConnectService.pursePay(rawTx, parents);
      return res.partiallySignedTx;
   }

   async broadcast(rawTx) {
      await this.handCashConnectService.purseBroadcast(rawTx);
   }
};
