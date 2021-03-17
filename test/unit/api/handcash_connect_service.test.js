const chai = require('../../chai_extensions');

const HandCashConnectService = require('../../../src/api/handcash_connect_service');

const { expect } = chai;

describe('# HandCashConnectService - Unit Tests', () => {
   it('should raise a generic error', async () => {
      const genericError = new Error('Some parameter is wrong');
      expect(HandCashConnectService.handleApiError(genericError))
         .to
         .be
         .rejectedWith(genericError);
   });

   it('should raise a handcash cloud api error', async () => {
      const handcashApiError = {
         response: {
            statusCode: 401,
            data: {
               message: 'Something went wrong',
               info: {
                  field: 'field1',
               },
            },
         },
      };
      expect(HandCashConnectService.handleApiError(handcashApiError))
         .to
         .be
         .rejectedWith(handcashApiError);
   });
});
