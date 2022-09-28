const { PrivateKey, PublicKey } = require('bsv');

module.exports = class Account {
   constructor(handCashConnectService) {
      this.handCashConnectService = handCashConnectService;
   }

   generateRandomPrivateKeyPair = () => {
      const privateKey = PrivateKey.fromRandom();
      const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
      return {
         privateKey: privateKey.toHex(),
         publicKey: publicKey.toHex(),
      }
   }

   requestEmailCode = (email) => this.handCashConnectService.requestEmailCode(email);

   verifyEmailCode = (requestId, verificationCode, accessPublicKey) => this
      .handCashConnectService.verifyEmailCode(requestId, verificationCode, accessPublicKey);

   createNewAccount = (accessPublicKey, email, referrerAlias) => this
      .handCashConnectService.createNewAccount(accessPublicKey, email, referrerAlias)
}
