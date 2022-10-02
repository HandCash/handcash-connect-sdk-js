import { describe, it, expect } from 'vitest';
import HttpRequestFactory from '../../api/http_request_factory';
import Environments from '../../environments';

describe('# HttpRequestFactory - Unit Tests', () => {
	it('should raise an invalid auth token error', async () => {
		const authToken = 'invalid-token-123';
		const appSecret = '1234567890';
		const appId = 'id1';
		return expect(
			() =>
				new HttpRequestFactory({
					authToken,
					baseApiEndpoint: Environments.iae.apiEndpoint,
					baseTrustholderEndpoint: Environments.iae.trustholderEndpoint,
					appSecret,
					appId,
				})
		).to.throw('Invalid authToken');
	});
});
