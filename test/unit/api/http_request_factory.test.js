const chai = require('../../chai_extensions');

const HttpRequestFactory = require('../../../src/api/http_request_factory');
const { Environments } = require('../../../src/index');

const { expect } = chai;

describe('# HttpRequestFactory - Unit Tests', () => {
   it('should raise an invalid auth token error', async () => {
      const authToken = 'invalid-token-123';
      const appSecret = '1234567890';
      const appId = 'id1';
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint,
         Environments.iae.trustholderEndpoint, appSecret, appId))
         .to
         .throw('Invalid authToken');
   });

   it('should raise missing app secret error', async () => {
      const authToken = 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262';
      const appSecret = undefined;
      const appId = 'id1';
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint,
         Environments.iae.trustholderEndpoint, appSecret, appId))
         .to
         .throw('Missing appSecret');
   });

   it('should raise missing app id error', async () => {
      const authToken = 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262';
      const appSecret = `1234567890`;
      const appId = undefined;
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint,
         Environments.iae.trustholderEndpoint, appSecret, appId))
         .to
         .throw('Missing appId');
   });
});
