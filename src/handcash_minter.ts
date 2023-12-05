import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import {
	AddMintOrderItemsParams,
	CreateItemsOrder,
	CollectionDefinition,
	CollectionMetadata,
	OrdinalItem,
	CreateCollectionItemsParams,
	CreateCollectionItemResult,
} from './types/items';
import { PaymentResult } from './types/payments';
import JsonCollectionMetadataLoader from './minter/json_items_loader';

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

	jsonItemsLoader: JsonCollectionMetadataLoader = new JsonCollectionMetadataLoader();

	static fromAppCredentials(params: Params) {
		const environment = params.env || Environments.prod;
		return new HandCashMinter({
			handCashConnectService: new HandCashConnectService({
				appId: params.appId,
				appSecret: '',
				authToken: params.authToken,
				baseApiEndpoint: environment.apiEndpoint,
				baseTrustholderEndpoint: environment.trustholderEndpoint,
			}),
			collectionMetadataLoader: new JsonCollectionMetadataLoader(),
		});
	}

	constructor({
		handCashConnectService,
		collectionMetadataLoader,
	}: {
		handCashConnectService: HandCashConnectService;
		collectionMetadataLoader: JsonCollectionMetadataLoader;
	}) {
		this.handCashConnectService = handCashConnectService;
		this.jsonItemsLoader = collectionMetadataLoader;
	}

	loadMetadataFromJson(rawData: string): Promise<CollectionDefinition> {
		return this.jsonItemsLoader.loadFromData(rawData);
	}

	/**
	 *
	 * Create Items
	 *
	 * @param params {AddMintOrderItemsParams}
	 * returns {Promise<OrdinalItem[]}
	 *
	 * */
	async createCollectionItems(params: CreateCollectionItemsParams): Promise<CreateCollectionItemResult> {
		return this.handCashConnectService.createItems(params);
	}

	/**
	 *
	 * Creates an order to inscribe a collection.
	 *
	 * @param collectionMetadata {CollectionMetadata}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	async createCollectionOrder(collectionMetadata: CollectionMetadata): Promise<CreateItemsOrder> {
		return this.handCashConnectService.createOrder({
			items: [collectionMetadata],
			itemCreationOrderType: 'collection',
		});
	}

	/**
	 *
	 * Creates an order to inscribe items.
	 *
	 * @param referencedCollection {string} The id of the collection that the items belong to
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	createCollectionItemsOrder(referencedCollection: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.createOrder({
			items: [],
			itemCreationOrderType: 'collectionItem',
			referencedCollection,
		});
	}

	/**
	 * Adds items to an existing items order.
	 * @param params - Parameters for adding items to an order
	 * @returns - Promise of CreateItemsOrder
	 */
	async addOrderItems(params: AddMintOrderItemsParams): Promise<CreateItemsOrder> {
		return this.handCashConnectService.addOrderItems(params);
	}

	/**
	 *
	 * Commits the existing order so no more items can be added to it. The payment should be completed afterwards.
	 *
	 * @param orderId {string}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	commitOrder(orderId: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.commitOrder(orderId);
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
	getOrder(orderId: string): Promise<CreateItemsOrder> {
		return this.handCashConnectService.getCreateItemsOrder(orderId);
	}

	/**
	 *
	 * Gets the items in an order by its id. The order must be completed.
	 *
	 * @param orderId {string}
	 * @returns {Promise<OrdinalItem[]}
	 *
	 * */
	getOrderItems(orderId: string): Promise<OrdinalItem[]> {
		return this.handCashConnectService.getItemsByOrder(orderId).then((response) => response.items);
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
