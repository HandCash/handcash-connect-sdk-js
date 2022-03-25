const chai = require('../../chai_extensions');

const { Environments, HandCashConnect } = require('../../../src/index');

const { expect } = chai;

describe('# HandCashConnect - Unit Tests', () => {
   it('should initialize with default environment', async () => {
      const appId = '1234567890';
      const appSecret = '1234567890';
      const handCashConnect = new HandCashConnect({
         appId,
         appSecret,
      });
      expect(handCashConnect.env).to.eq(Environments.prod);
   });
});
