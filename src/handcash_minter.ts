import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import {
	AddMintOrderItemsParams,
	CreateItemsOrder,
	CollectionDefinition,
	CollectionMetadata,
	OrdinalItem,
} from './types/items';
import { PaymentResult } from './types/payments';
import JsonCollectionMetadataLoader from './minter/json_items_loader';
import CloudinaryImageService from './minter/cloudinary_image_service';
import pLimit from 'p-limit';

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

	imageService: CloudinaryImageService;

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
			imageService: new CloudinaryImageService({
				apiKey: environment.cloudinary.apiKey,
				cloudName: environment.cloudinary.cloudName,
				uploadPreset: environment.cloudinary.uploadPreset,
			}),
		});
	}

	constructor({
		handCashConnectService,
		collectionMetadataLoader,
		imageService,
	}: {
		handCashConnectService: HandCashConnectService;
		collectionMetadataLoader: JsonCollectionMetadataLoader;
		imageService: CloudinaryImageService;
	}) {
		this.handCashConnectService = handCashConnectService;
		this.jsonItemsLoader = collectionMetadataLoader;
		this.imageService = imageService;
	}

	loadMetadataFromJson(rawData: string): Promise<CollectionDefinition> {
		return this.jsonItemsLoader.loadFromData(rawData);
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
		const { imageUrl } = await this.imageService.uploadImage(collectionMetadata.mediaDetails.image.url);
		// eslint-disable-next-line no-param-reassign
		collectionMetadata.mediaDetails.image.url = imageUrl;
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
	 *
	 * Adds items to an existing items order.
	 *
	 * @param params {AddMintOrderItemsParams}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	async addOrderItems(params: AddMintOrderItemsParams): Promise<CreateItemsOrder> {
		const limit = pLimit(5);
		await Promise.all(
			params.items.map((item) => limit (async() => {
				if (item.mediaDetails.image.url.includes('https://res.cloudinary.com')) {
					return;
				}
				const { imageUrl } = await this.imageService.uploadImage(item.mediaDetails.image.url);
				if(item.mediaDetails.image.imageHighResUrl) {
					const { imageUrl } = await this.imageService.uploadImage(item.mediaDetails.image.imageHighResUrl);
					// eslint-disable-next-line no-param-reassign
					item.mediaDetails.image.imageHighResUrl = imageUrl;

				}
				// eslint-disable-next-line no-param-reassign
				item.mediaDetails.image.url = imageUrl;
			}))
		);
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
