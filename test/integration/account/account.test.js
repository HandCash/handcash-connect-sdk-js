const chai = require('../../chai_extensions');
chai.use(require('chai-as-promised'));
const publicProfileApiDefinition = require('../profile/publicUserProfile.api-definition');
const { HandCashConnect, Environments } = require('../../../src/index');

const { expect } = chai;

describe('# Account - Integration Tests', () => {
   before(async () => {
      const appSecret = process.env.app_secret;
      const appId = process.env.app_id;
      this.cloudAccount = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.iae,
      }).getFeatureAccount();
   });

   it('should request email code, verify it and create new account', async () => {
      const email = 'app.review@handcash.io';
      const verificationCode = "12345678";
      const keyPair = this.cloudAccount.account.generateRandomPrivateKeyPair();
      const requestId = await this.cloudAccount.account.requestEmailCode(email);
      expect(requestId).to.be.ok;
      await this.cloudAccount.account.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
      const publicProfile = await this.cloudAccount.account.createNewAccount(keyPair.publicKey, email);
      expect.definitionToMatch(publicProfileApiDefinition, publicProfile);
   });
});
