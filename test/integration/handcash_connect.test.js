const chai = require('../chai_extensions');
chai.use(require('chai-as-promised'));
const publicProfileApiDefinition = require('./profile/publicUserProfile.api-definition');
const { HandCashConnect, Environments } = require('../../src');

const { expect } = chai;

describe('# HandCash Connect - Integration Tests', () => {
   before(async () => {
      const appSecret = process.env.app_secret;
      const appId = process.env.app_id;
      this.handCashConnect = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.iae,
      });
   });

   it('should request email code, verify it and create new account', async () => {
      const email = 'app.review@handcash.io';
      const verificationCode = "12345678";
      const keyPair = this.handCashConnect.generateAuthenticationKeyPair();
      const requestId = await this.handCashConnect.requestEmailCode(email);
      await this.handCashConnect.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
      const publicProfile = await this.handCashConnect.createNewAccount(keyPair.publicKey, email);
      expect.definitionToMatch(publicProfileApiDefinition, publicProfile);

      const cloudAccount = this.handCashConnect.getAccountFromAuthToken(keyPair.privateKey);
      const profile = await cloudAccount.profile.getCurrentProfile();
      expect.definitionToMatch(publicProfileApiDefinition, profile.publicProfile);
   });
});
