import HandCashConnectService from '../api/handcash_connect_service';
import HttpRequestFactory from '../api/http_request_factory';
import Environments from '../environments';
import { TxInput, TxLock } from '../types/bsv';

export type OwnerParams = {
	authToken: string;
	appSecret?: string;
	appId?: string;
	env?: typeof Environments.prod;
};

export default class HandCashOwner {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 *
	 * @param {string} params.authToken - Your personal auth token. Should be a hex string.
	 * @param {string} [params.appId] - Optional: The app id of your app. You get it from your developer dashboard.
	 * @param {string} [params.appSecret] - Optional: The app secret of your app. You get it from your developer dashboard.
	 * @param {Object} [params.env] - Optional: The environment to use. Defaults to prod.
	 * @param {string} params.env.apiEndpoint - The API url to use.
	 * @param {string} params.env.clientUrl - The client url to use.
	 * @param {string} params.env.trustholderEndpoint - The trustholder url to use.
	 *
	 * @returns {object} HandCashOwner - A HandCashOwner instance. It is needed to create the Run instance.
	 *
	 */
	static fromAuthToken(params: OwnerParams): HandCashOwner {
		const { authToken, env = Environments.prod, appSecret = '', appId = '' } = params;
		const handCashConnectService = new HandCashConnectService(
			new HttpRequestFactory({
				authToken,
				baseApiEndpoint: env.apiEndpoint,
				baseTrustholderEndpoint: env.trustholderEndpoint,
				appSecret,
				appId,
			})
		);
		return new HandCashOwner(handCashConnectService);
	}

	/**
	 *
	 * @param {string} alias - HandCash handle of the next owner.
	 *
	 * @returns {string} ownerAddress - The address of the next owner.
	 *
	 */
	async nextOwner(alias?: string): Promise<string> {
		const res = await this.handCashConnectService.ownerNextAddress(alias);
		return res.ownerAddress;
	}

	/**
	 *
	 * @param {string} rawTx - Hex string of the raw transaction you want to sign.
	 * @param {Array} parents - Array of transaction inputs. Each input is an object with the following properties:
	 * @param {string} parents.satoshis - The amount of satoshis in the input.
	 * @param {number} parents.script - The script of the input.
	 * @param {Array} locks - Array of locks. Each lock is an object with the following properties:
	 * @param {string} locks.address - The address of the locking script.
	 *
	 * @returns {string} signedTransaction - Hex string of the signed transaction.
	 *
	 */

	async sign(rawTx: string, parents: TxInput[], locks: TxLock[]): Promise<string> {
		const res = await this.handCashConnectService.ownerSign(rawTx, parents, locks);
		return res.signedTransaction;
	}

	async getNftLocations(): Promise<string[]> {
		const res = await this.handCashConnectService.getNftLocations();
		return res.nftLocations;
	}
}
