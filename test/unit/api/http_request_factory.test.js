const chai = require('../../chai_extensions');

const HttpRequestFactory = require('../../../src/api/http_request_factory');
const { Environments } = require('../../../src/index');

const { expect } = chai;

describe('# HttpRequestFactory - Unit Tests', () => {
   it('should raise a missing auth token error', async () => {
      const authToken = undefined;
      const appSecret = '1234567890';
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint, appSecret))
         .to
         .throw('Missing authToken');
   });

   it('should raise an invalid auth token error', async () => {
      const authToken = 'invalid-token-123';
      const appSecret = '1234567890';
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint, appSecret))
         .to
         .throw('Invalid authToken');
   });

   it('should raise an invalid app secret error', async () => {
      const authToken = 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262';
      const appSecret = undefined;
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint, appSecret))
         .to
         .throw('Missing appSecret');
   });
});
