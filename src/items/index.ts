import HandCashConnectService from '../api/handcash_connect_service';
import { GetItemsFilter, ConnectTransferResult, Item, TransferItemParameters } from '../types/items';

export default class Items {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 * Get the items available in the user's inventory.
	 * See {@link https://docs.handcash.io/docs/user-inventory} for more information.
	 *
	 *  @param {GetItemsFilter} getItemsParameters Defines the parameters to filter items
	 *
	 * @returns {Promise<OrdinalItem[]>} A promise that resolves with a list of ordinals from the user inventory.
	 */
	async getItemsInventory(getItemsParameters: GetItemsFilter): Promise<Item[]> {
		return this.handCashConnectService.getItemsInventory(getItemsParameters).then((response) => response.items);
	}

	/**
	 * Get the items listed for sale by the user.
	 * See {@link https://docs.handcash.io/docs/user-listings} for more information.
	 *
	 * @param {GetItemsFilter} getItemsParameters Defines the parameters to filter items
	 *
	 * @returns {Promise<OrdinalItem[]>} A promise that resolves with a list of ordinals listed by the user.
	 */
	async getItemListings(getItemsParameters: GetItemsFilter): Promise<Item[]> {
		return this.handCashConnectService.getItemListings(getItemsParameters).then((response) => response.items);
	}

	/**
	 * Transfer one or many items to one or many destinations.
	 * See {@link https://docs.handcash.io/docs/user-listings} for more information.
	 *
	 * @param {GetItemsFilter} params Defines the item origins and destinations
	 *
	 * @returns {Promise<ConnectTransferResult>} A promise that resolves with the result of the transfer.
	 */
	async transfer(params: TransferItemParameters): Promise<ConnectTransferResult> {
		return this.handCashConnectService.transferItems(params);
	}
}
