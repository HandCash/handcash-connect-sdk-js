const chai = require('../../chaiExtensions');

const { HandCashConnect, Environments } = require('../../../src/index');

const { expect } = chai;

describe('# Authorization - Integration Tests', () => {
   it('should get a redirection URL', async () => {
      const appId = '1234567890';
      const handCashConnect = new HandCashConnect(appId, Environments.iae);
      const redirectionLoginUrl = handCashConnect.getRedirectionUrl();

      expect(redirectionLoginUrl)
         .to
         .be
         .a('String');
      expect(redirectionLoginUrl)
         .includes(Environments.iae.clientUrl);
      expect(redirectionLoginUrl)
         .includes(appId);
   });

   it('should get a redirection URL for default environment (prod)', async () => {
      const appId = '1234567890';
      const handCashConnect = new HandCashConnect(appId);
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
