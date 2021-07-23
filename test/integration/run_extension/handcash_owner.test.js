const Run = require('run-sdk');

const { HandCashOwner, HandCashPurse, Environments } = require('../../../src/index');
const ownerTests = require('./owner_tests');

describe('# HandCashOwner - Integration Tests', () => {
   before(async () => {
      const authToken = process.env.test_authToken;
      const env = Environments.iae;
      this.handcashOwner = HandCashOwner.fromAuthToken(authToken, env);
      this.handcashPurse = HandCashPurse.fromAuthToken(authToken, env);
   });

   it('should pass the owner tests defined by the Run SDK', async () => {
      const run = new Run({
         owner: this.handcashOwner,
         purse: this.handcashPurse,
      });
      await ownerTests(run);
   }).timeout(20000);
});
