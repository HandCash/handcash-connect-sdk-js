const chai = require('../../chai_extensions');

const { HandCashConnect, Environments } = require('../../../src/index');

const { expect } = chai;

describe('# Authorization - Integration Tests', () => {
   it('should get a redirection URL to authorize app', async () => {
      const appId = '1234567890';
      const appSecret = process.env.app_secret;
      const handCashConnect = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.prod,
      });
      const redirectionLoginUrl = handCashConnect.getRedirectionUrl();

      expect(redirectionLoginUrl)
         .to
         .be
         .a('String');
      expect(redirectionLoginUrl)
         .includes(Environments.prod.clientUrl);
      expect(redirectionLoginUrl)
         .includes(appId);
   });

   it('should get a redirection URL to authorize app for default environment (prod)', async () => {
      const appId = '1234567890';
      const appSecret = process.env.app_secret;
      const handCashConnect = new HandCashConnect({
         appId,
         appSecret,
         env: Environments.prod,
      });
      const redirectionLoginUrl = handCashConnect.getRedirectionUrl();

      expect(redirectionLoginUrl)
         .to
         .be
         .a('String');
      expect(redirectionLoginUrl)
         .includes(Environments.prod.clientUrl);
      expect(redirectionLoginUrl)
         .includes(appId);
   });
});
