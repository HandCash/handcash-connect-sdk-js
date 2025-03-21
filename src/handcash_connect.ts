import crypto from 'crypto';
import { secp256k1 } from '@noble/curves/secp256k1';
import { KeyPair } from './types/bsv';
import HandCashCloudAccount from './handcash_cloud_account';
import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import { UserPublicProfile } from './types/account';
import {
	ItemListingPaymentCompletedEventPayload,
	ItemsTransferredEventPayload,
	ItemCreationEventPayload,
	WebhookPayload,
} from './types/events';
import { QueryParams } from './types/http';

type Params = {
	appId: string;
	appSecret: string;
	env?: (typeof Environments)['prod'];
};

/**
 *
 * HandCashConnect is the main class of the HandCash Connect SDK.
 * It is used to create a HandCashConnect instance, which is used to authenticate users, get their data and make payments.
 *
 * @param {string} appId - The app id of your app. You get it from your developer dashboard.
 * @param {string} appSecret - The app secret of your app. You get it from your developer dashboard.
 * @param {Object} [env] - Optional: The environment to use. Defaults to prod.
 * @param {string} env.apiEndpoint - The API url to use.
 * @param {string} env.clientUrl - The client url to use.
 * @param {string} env.trustholderEndpoint - The trustholder url to use.
 *
 */

export default class HandCashConnect {
	appId: string;

	appSecret: string;

	handCashConnectService: HandCashConnectService;

	env: (typeof Environments)['prod'];

	constructor({ appId, appSecret, env = Environments.prod }: Params) {
		this.appId = appId;
		this.appSecret = appSecret;
		this.env = env;
		this.handCashConnectService = new HandCashConnectService({
			appId: this.appId,
			appSecret: this.appSecret,
			baseApiEndpoint: this.env.apiEndpoint,
			baseTrustholderEndpoint: this.env.trustholderEndpoint,
		});
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
		const privateKey = secp256k1.utils.randomPrivateKey();
		const publicKey = secp256k1.getPublicKey(privateKey, true);
		return {
			privateKey: Buffer.from(privateKey).toString('hex'),
			publicKey: Buffer.from(publicKey).toString('hex'),
		};
	};

	/**
	 * Sends a verification code to the email provided by the user.
	 *
	 * @param {string} email - The email address of the user.
	 * @param {Object} [customEmailParameters] - Optional: Custom parameters to be added to the email.
	 *
	 * @returns {string} requestId - The request id.
	 */
	requestEmailCode(email: string, customEmailParameters?: object): Promise<string> {
		return this.handCashConnectService.requestEmailCode(email, customEmailParameters);
	}

	/**
	 *
	 * Verifies the email code that was sent to the user's email.
	 *
	 * @param {string} requestId - The request id that you get from the requestEmailCode method.
	 * @param {string} verificationCode - The verification code that was sent to the user's email.
	 * @param {string} accessPublicKey - The access public key of the user.
	 *
	 */
	verifyEmailCode(requestId: string, verificationCode: string, accessPublicKey: string): Promise<void> {
		return this.handCashConnectService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
	}

	/**
	 * Creates a new account for the verified email along with some authentication public key.
	 * @deprecated Use createAccount instead
	 * 
	 * @param {string} accessPublicKey - The access public key of the user.
	 * @param {string} email - The email address of the user.
	 *
	 * @returns {Object} UserPublicProfile - The user's public profile.
	 *
	 */
	createNewAccount(accessPublicKey: string, email: string): Promise<UserPublicProfile> {
		return this.handCashConnectService.createNewAccount({
			accessPublicKey, email,
		});
	}

	/**
	 * Creates a new account for the verified email along with some authentication public key.
	 *
	 * @param {Object} params - The parameters for creating a new account
	 * @param {string} params.accessPublicKey - The access public key of the user.
	 * @param {string} params.email - The email address of the user.
	 * @param {string} [params.alias] - Optional: The alias of the user for the new account. Example: satoshi.33
	 *
	 * @returns {Object} UserPublicProfile - The user's public profile.
	 *
	 */
	createAccount(params: {
		accessPublicKey: string;
		email: string;
		alias?: string;
	}): Promise<UserPublicProfile> {
		return this.handCashConnectService.createNewAccount(params);
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
		return HandCashCloudAccount.fromAuthToken({
			authToken,
			appSecret: this.appSecret,
			appId: this.appId,
			baseApiEndpoint: this.env.apiEndpoint,
			baseTrustholderEndpoint: this.env.trustholderEndpoint,
		});
	}

	/**
	 * Gets the event type from the incoming webhook request.
	 *
	 * @param request - The incoming web request object.
	 * @returns {WebhookPayload} - The event type.
	 * @throws {Error} - Throws an error if the validation fails or the event type is unknown.
	 */
	getWebhookEvent = (signature: string, body: any): WebhookPayload => {
		if (!signature) {
			throw new Error('No signature provided');
		}
		const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60000);
		if (new Date(body.created) < fiveMinutesAgo) {
			throw new Error('Timestamp is too old');
		}

		const hmac = crypto.createHmac('sha256', this.appSecret);
		hmac.update(JSON.stringify(body));
		const generatedSignature = hmac.digest('hex');
		if (generatedSignature !== signature) {
			throw new Error('Invalid signature');
		}

		switch (body.event) {
			case 'item_listing_payment_completed':
				return body as ItemListingPaymentCompletedEventPayload;
			case 'items_transferred':
				return body as ItemsTransferredEventPayload;
			case 'item_creation_order_completed':
				return body as ItemCreationEventPayload;
			default:
				throw new Error(`Unknown event type: ${body.event}`);
		}
	};
}
