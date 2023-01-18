import { PrivateKey } from 'bsv-wasm';
import { z } from 'zod';
import { KeyPair } from './types/bsv';
import HandCashCloudAccount from './handcash_cloud_account';
import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import HttpRequestFactory from './api/http_request_factory';
import { UserPublicProfile } from './types/account';
import { QueryParams, QueryParamsZ } from './types/http';

const paramsZ = z.object({
	appId: z.string(),
	appSecret: z.string(),
	env: z
		.object({
			apiEndpoint: z.string(),
			clientUrl: z.string(),
			trustholderEndpoint: z.string(),
		})
		.optional(),
});

type Params = z.infer<typeof paramsZ>;

const VerifyEmailInputZ = z.object({
	requestId: z.string(),
	verificationCode: z.string(),
	accessPublicKey: z.string(),
});

type VerifyEmailInput = z.infer<typeof VerifyEmailInputZ>;

const CreateAccountParamsZ = z.object({
	accessPublicKey: z.string(),
	email: z.string(),
	referrerAlias: z.string().optional(),
});

type CreateAccountParams = z.infer<typeof CreateAccountParamsZ>;

/**
 *
 * HandCashConnect is the main class of the HandCash Connect SDK.
 * It is used to create a HandCashConnect instance, which is used to authenticate users, get their data and make payments.
 *
 * @param {string} params.appId - The app id of your app. You get it from your developer dashboard.
 * @param {string} params.appSecret - The app secret of your app. You get it from your developer dashboard.
 * @param {Object} [params.env] - Optional: The environment to use. Defaults to prod.
 * @param {string} params.env.apiEndpoint - The API url to use.
 * @param {string} params.env.clientUrl - The client url to use.
 * @param {string} params.env.trustholderEndpoint - The trustholder url to use.
 *
 */

export default class HandCashConnect {
	appId: string;

	appSecret: string;

	handCashConnectService: HandCashConnectService;

	env: (typeof Environments)['prod'];

	constructor(params: Params) {
		try {
			paramsZ.parse(params);
		} catch (err) {
			throw new Error('Parameters not of correct type');
		}

		const { appId, appSecret, env = Environments.prod } = params;

		this.appId = appId;
		this.appSecret = appSecret;
		this.env = env;
		this.handCashConnectService = new HandCashConnectService(
			new HttpRequestFactory({
				appId: this.appId,
				appSecret: this.appSecret,
				baseApiEndpoint: this.env.apiEndpoint,
				baseTrustholderEndpoint: this.env.trustholderEndpoint,
			})
		);
	}

	/**
	 *
	 * Generates the OAuth URL to redirect the user to HandCash.
	 *
	 * @param {Object} queryParameters - Query parameters to be added to the URL.
	 *
	 * @returns {string} redirectionUrl - The URL to redirect the user to.
	 *
	 * */
	getRedirectionUrl(queryParameters: QueryParams = {}): string {
		try {
			QueryParamsZ.parse(queryParameters);
		} catch (err) {
			throw new Error('queryParameters must be an object with string keys and string values');
		}

		// eslint-disable-next-line no-param-reassign
		queryParameters.appId = this.appId;
		const encodedParams = Object.entries(queryParameters)
			.map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val.toString())}`)
			.join('&');
		return `${this.env.clientUrl}/#/authorizeApp?${encodedParams}`;
	}

	/**
	 *
	 * Gets the URL to redirect the user to in order to adjust their spending limits.
	 *
	 * @param {string} [redirectUrl] - Optional: Make use of the redirectUrl parameter to have the user redirected back to your app following their limit change.
	 *
	 * @returns {string} redirectionUrl - The URL to redirect the user to.
	 *
	 */
	getChangeSpendLimitsUrl(redirectUrl?: string): string {
		try {
			z.string().optional().parse(redirectUrl);
		} catch (err) {
			throw new Error('redirectUrl must be a string');
		}

		const url = `${this.env.clientUrl}/#/settings/spendLimits`;
		return url + (redirectUrl ? `?redirectUrl=${redirectUrl}` : '');
	}

	/**
	 *
	 * Generates a new authentication keypair (private and public key).
	 * This is the first step to create a new HandCash account.
	 *
	 * @returns {Object} keyPair - The key pair.
	 * @returns {string} keyPair.privateKey - The private key in hex format.
	 * @returns {string} keyPair.publicKey - The public key in hex format.
	 *
	 * */
	// eslint-disable-next-line class-methods-use-this
	generateAuthenticationKeyPair = (): KeyPair => {
		const privateKey = PrivateKey.from_random();
		const publicKey = privateKey.to_public_key();
		return {
			privateKey: privateKey.to_hex(),
			publicKey: publicKey.to_hex(),
		};
	};

	/**
	 * Sends a verification code to the email provided by the user.
	 *
	 * @param {string} email - The email address of the user.
	 *
	 * @returns {string} requestId - The request id.
	 */
	requestEmailCode(email: string): Promise<string> {
		try {
			z.string().parse(email);
		} catch (err) {
			throw new Error('Invalid email');
		}

		return this.handCashConnectService.requestEmailCode(email);
	}

	/**
	 *
	 * Verifies the email code that was sent to the user's email.
	 *
	 * @param {string} params.requestId - The request id that was returned by the requestEmailCode method.
	 * @param {string} params.verificationCode - The verification code that was sent to the user's email.
	 * @param {string} params.accessPublicKey - The access public key of the user.
	 *
	 */
	verifyEmailCode(params: VerifyEmailInput): Promise<void> {
		try {
			VerifyEmailInputZ.parse(params);
		} catch (err) {
			throw new Error('Invalid VerifyEmailCode input type');
		}

		const { accessPublicKey, requestId, verificationCode } = params;
		return this.handCashConnectService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
	}

	/**
	 * Creates a new account for the verified email along with some authentication public key.
	 *
	 * @param {string} params.accessPublicKey - The access public key of the user.
	 * @param {string} params.email - The email address of the user.
	 * @param {string} [params.referrerAlias] - Optional: The alias of the user that referred the new user.
	 *
	 * @returns {Object} UserPublicProfile - The user's public profile.
	 *
	 */
	createNewAccount(params: CreateAccountParams): Promise<UserPublicProfile> {
		try {
			CreateAccountParamsZ.parse(params);
		} catch (err) {
			throw new Error('Invalid CreateAccountParams input type');
		}

		const { accessPublicKey, email, referrerAlias } = params;
		return this.handCashConnectService.createNewAccount(accessPublicKey, email, referrerAlias);
	}

	/**
	 * Initializes the account as usually using the authentication private key.
	 *
	 * @param {string} authToken - The authentication private key.
	 *
	 * @returns {Object} HandCashCloundAccount - The full HandCash cloud account of the user.
	 *
	 */
	getAccountFromAuthToken(authToken: string): HandCashCloudAccount {
		try {
			z.string().parse(authToken);
		} catch (err) {
			throw new Error('Invalid authToken. It must be a hex string.');
		}

		return HandCashCloudAccount.fromAuthToken({
			authToken,
			appSecret: this.appSecret,
			appId: this.appId,
			baseApiEndpoint: this.env.apiEndpoint,
			baseTrustholderEndpoint: this.env.trustholderEndpoint,
		});
	}
}
