const chai = require('../../chai_extensions');

const { HandCashConnect, Environments } = require('../../../src/index');

const { expect } = chai;

describe('# Spend Limits - Integration Tests', () => {
   it('should get a redirection URL to change the spend limits', async () => {
      const appId = '1234567890';
      const appSecret = process.env.app_secret;
      const handCashConnect = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.iae,
      });
      const redirectUrl = 'https://mysite.com';
      const changeSpendLimitsUrl = handCashConnect.getChangeSpendLimitsUrl(redirectUrl);

      expect(changeSpendLimitsUrl)
         .to
         .be
         .a('String');
      expect(changeSpendLimitsUrl)
         .includes(Environments.iae.clientUrl);
      expect(changeSpendLimitsUrl)
         .includes(redirectUrl);
   });

   it('should get a redirection URL to change the spend limits without redirection url', async () => {
      const appId = '1234567890';
      const appSecret = process.env.app_secret;
      const handCashConnect = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.iae,
      });
      const changeSpendLimitsUrl = handCashConnect.getChangeSpendLimitsUrl();

      expect(changeSpendLimitsUrl)
         .to
         .be
         .a('String');
      expect(changeSpendLimitsUrl)
         .includes(Environments.iae.clientUrl);
   });
});
