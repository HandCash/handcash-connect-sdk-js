import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import { AddMintOrderItemsParams, CreateItemsOrder, NewCreateItemsOrder } from './types/items';
import { PaymentResult } from './types/payments';

type Params = {
	appId: string;
	authToken: string;
	env?: (typeof Environments)['prod'];
};

/**
 *
 * HandCashMinter provides all the features needed to inscribe ordinals.
 *
 * @param {string} appId - The app id of your app. You get it from your developer dashboard.
 * @param {string} appSecret - The app secret of your app. You get it from your developer dashboard.
 * @param {Object} [env] - Optional: The environment to use. Defaults to prod.
 *
 */

export default class HandCashMinter {
	handCashConnectService: HandCashConnectService;

	constructor({ appId, authToken, env = Environments.prod }: Params) {
		this.handCashConnectService = new HandCashConnectService({
			appId,
			appSecret: '',
			authToken,
			baseApiEndpoint: env.apiEndpoint,
			baseTrustholderEndpoint: env.trustholderEndpoint,
		});
	}

	/**
	 *
	 * Creates a mint order that contains the items and order type.
	 *
	 * @param newCreateItemsOrder {NewCreateItemsOrder}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	createMintOrder(newCreateItemsOrder: NewCreateItemsOrder): Promise<CreateItemsOrder> {
		return this.handCashConnectService.createMintOrder(newCreateItemsOrder);
	}

	/**
	 *
	 * Gets an already created items order by its id.
	 *
	 * @param params {AddMintOrderItemsParams}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	addMintOrderItems(params: AddMintOrderItemsParams): Promise<CreateItemsOrder> {
		return this.handCashConnectService.addMintOrderItems(params);
	}

	/**
	 *
	 * Commits the existing order so no more items can be added to it. The payment should be completed afterwards.
	 *
	 * @param orderId {string}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	commitMintOrder(orderId: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.commitMintOrder(orderId);
	}

	/**
	 *
	 * After the payment has been completed, this method is used to inscribe in the items in the blockchain in batches.
	 *
	 * @param orderId {string}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	inscribeNextBatch(orderId: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.inscribeNextBatch(orderId);
	}

	/**
	 *
	 * Gets an already created items order by its id.
	 *
	 * @param orderId {string}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	getCreateItemsOrder(orderId: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.getCreateItemsOrder(orderId);
	}

	/**
	 *
	 * Pays a payment request from an items order.
	 *
	 * @param paymentRequestId {string}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	payPaymentRequest(paymentRequestId: string): Promise<PaymentResult> {
		return this.handCashConnectService.payPaymentRequest(paymentRequestId);
	}
}
