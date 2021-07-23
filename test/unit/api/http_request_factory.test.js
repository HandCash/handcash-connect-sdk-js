const chai = require('../../chai_extensions');

const HttpRequestFactory = require('../../../src/api/http_request_factory');
const { Environments } = require('../../../src/index');

const { expect } = chai;

describe('# HttpRequestFactory - Unit Tests', () => {
   it('should raise a missing auth token error', async () => {
      const authToken = undefined;
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint))
         .to
         .throw('Missing authToken');
   });

   it('should raise an invalid auth token error', async () => {
      const authToken = 'invalid-token-123';
      return expect(() => new HttpRequestFactory(authToken, Environments.iae.apiEndpoint))
         .to
         .throw('Invalid authToken');
   });
});
