import { z } from 'zod';
import HandCashConnectService from '../api/handcash_connect_service';
import HttpRequestFactory from '../api/http_request_factory';
import Environments from '../environments';
import { TxInput, TxInputZ } from '../types/bsv';
import { OwnerParams, OwnerParamsZ } from './handcash_owner';

export default class HandCashPurse {
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
	 * @returns {object} HandCashPurse - A HandCashPurse instance. It is needed to create the Run instance.
	 *
	 */
	static fromAuthToken(params: OwnerParams): HandCashPurse {
		try {
			OwnerParamsZ.parse(params);
		} catch (err) {
			throw new Error('Invalid params to create HandCashPurse. Please check the documentation.');
		}

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
		return new HandCashPurse(handCashConnectService);
	}

	/**
	 *
	 * @param {string} rawTx - Hex string of the raw transaction.
	 * @param {Array} parents - Array of transaction inputs. Each input is an object with the following properties:
	 * @param {string} parents.satoshis - The amount of satoshis in the input.
	 * @param {number} parents.script - The script of the input.
	 *
	 * @returns {string} ownerAddress - The address of the next owner.
	 *
	 */
	async pay(rawTx: string, parents: TxInput[]): Promise<string> {
		try {
			z.string().parse(rawTx);
		} catch (err) {
			throw new Error('rawTx should be a valid hex string');
		}

		try {
			z.array(TxInputZ).parse(parents);
		} catch (err) {
			throw new Error("parents don't have the right format");
		}

		const res = await this.handCashConnectService.pursePay(rawTx, parents);
		return res.partiallySignedTx;
	}

	/**
	 *
	 * @param {string} rawTx - Hex string of the raw transaction to broadcast.
	 *
	 */
	async broadcast(rawTx: string): Promise<void> {
		try {
			z.string().parse(rawTx);
		} catch (err) {
			throw new Error('rawTx should be a valid hex string');
		}

		await this.handCashConnectService.purseBroadcast(rawTx);
	}
}
