const Run = require('run-sdk');

const { HandCashPurse, Environments } = require('../../../src/index');
const purseTests = require('./purse_tests');

describe('# HandCashPurse - Integration Tests', () => {
   before(async () => {
      const authToken = process.env.test_authToken;
      this.handcashPurse = HandCashPurse.fromAuthToken(authToken, Environments.iae);
   });

   it('should pass the purse tests defined by the Run SDK', async () => {
      const run = new Run({
         purse: this.handcashPurse,
      });
      await purseTests(run, false);
   });
});
