const { PrivateKey } = require('bsv');
const ECIES = require('bsv/ecies');

class Profile {
   constructor(handCashConnectService) {
      this.handCashConnectService = handCashConnectService;
   }

   async getCurrentProfile() {
      return this.handCashConnectService.getCurrentProfile();
   }

   async getPublicProfilesByHandle(handles) {
      return this.handCashConnectService.getPublicProfilesByHandle(handles)
         .then(result => result.items);
   }

   async getFriends() {
      return this.handCashConnectService.getUserFriends()
         .then(result => result.items);
   }

   async getPermissions() {
      return this.handCashConnectService.getUserPermissions()
         .then(result => result.items);
   }

   async getEncryptionKeypair() {
      const privateKey = PrivateKey.fromRandom();
      const encryptedKeypair = await this.handCashConnectService.getEncryptionKeypair(
         privateKey.publicKey.toString(),
      );
      return {
         publicKey: ECIES()
            .privateKey(privateKey)
            .decrypt(Buffer.from(encryptedKeypair.encryptedPublicKeyHex, 'hex'))
            .toString(),
         privateKey: ECIES()
            .privateKey(privateKey)
            .decrypt(Buffer.from(encryptedKeypair.encryptedPrivateKeyHex, 'hex'))
            .toString(),
      };
   }

   async signData(dataSignatureParameters) {
      return this.handCashConnectService.signData(dataSignatureParameters);
   }
}

module.exports = Profile;
