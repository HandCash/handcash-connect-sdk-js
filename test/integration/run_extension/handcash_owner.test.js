const Run = require('run-sdk');
const chai = require('../../chai_extensions');

const { expect } = chai;
const { HandCashOwner, HandCashPurse, Environments } = require('../../../src/index');
const ownerTests = require('./owner_tests');

describe('# HandCashOwner - Integration Tests', () => {
   before(async () => {
      const authToken = process.env.test_authToken;
      const appSecret = process.env.app_secret;
      const env = Environments.iae;
      this.handcashOwner = HandCashOwner.fromAuthToken(authToken, env, appSecret);
      this.handcashPurse = HandCashPurse.fromAuthToken(authToken, env, appSecret);
   });

   it('should pass the owner tests defined by the Run SDK', async () => {
      const run = new Run({
         owner: this.handcashOwner,
         purse: this.handcashPurse,
      });
      await ownerTests(run);
   }).timeout(30000);

   it('should get an address for the given alias', async () => {
      const address = await this.handcashOwner.nextOwner('tester');

      expect(address).to.be.a('string');
   });
});
