import Environments from './environments';
import HandCashConnectService from './api/handcash_connect_service';
import { AddMintOrderItemsParams, CreateItemsOrder, CreateItemsParameters, NewCreateItemsOrder } from './types/items';
import { PaymentResult } from './types/payments';
import JsonItemsLoader from './minter/json_items_loader';
import CloudinaryImageService from './minter/cloudinary_image_service';

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

	jsonItemsLoader: JsonItemsLoader = new JsonItemsLoader();

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
			jsonItemsLoader: new JsonItemsLoader(),
			imageService: new CloudinaryImageService({
				apiKey: environment.cloudinary.apiKey,
				cloudName: environment.cloudinary.cloudName,
				uploadPreset: environment.cloudinary.uploadPreset,
			}),
		});
	}

	constructor({
		handCashConnectService,
		jsonItemsLoader,
		imageService,
	}: {
		handCashConnectService: HandCashConnectService;
		jsonItemsLoader: JsonItemsLoader;
		imageService: CloudinaryImageService;
	}) {
		this.handCashConnectService = handCashConnectService;
		this.jsonItemsLoader = jsonItemsLoader;
		this.imageService = imageService;
	}

	loadItemsFromJson(filePath: string): Promise<CreateItemsParameters> {
		return this.jsonItemsLoader.loadFromFile(filePath);
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
	 * Adds items to an existing items order.
	 *
	 * @param params {AddMintOrderItemsParams}
	 * @returns {Promise<CreateItemsOrder}
	 *
	 * */
	async addMintOrderItems(params: AddMintOrderItemsParams): Promise<CreateItemsOrder> {
		await Promise.all(
			params.items.map(async (item) => {
				if (item.mediaDetails.image.url.includes('https://res.cloudinary.com')) {
					return;
				}
				const { imageUrl } = await this.imageService.uploadImage(item.mediaDetails.image.url);
				// eslint-disable-next-line no-param-reassign
				item.mediaDetails.image.url = imageUrl;
			})
		);
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