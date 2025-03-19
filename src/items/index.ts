import HandCashConnectService from '../api/handcash_connect_service';
import { GetItemsFilter, ItemTransferResult, Item, TransferItemParameters } from '../types/items';

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
	 * @returns {Promise<Item[]>} A promise that resolves with a list of ordinals from the user inventory.
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
	 * @returns {Promise<Item[]>} A promise that resolves with a list of ordinals listed by the user.
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
	 * @returns {Promise<ItemTransferResult>} A promise that resolves with the result of the transfer.
	 */
	async transfer(params: TransferItemParameters): Promise<ItemTransferResult> {
		return this.handCashConnectService.transferItems(params);
	}

	/**
	 * Get Item by origin
	 * @param {string} origin The origin of the item
	 * @returns {Promise<Item>} A promise that resolves with the item.
	 */
	async getItemByOrigin(origin: string): Promise<Item> {
		return this.handCashConnectService.getItemByOrigin(origin);
	}

	/**
	 * Get all locked items
	 * @returns {Promise<Item[]>} A promise that resolves with the locked items.
	 */
	async getLockedItems(params: { from?: number; to?: number; fetchAttributes?: boolean }): Promise<Item[]> {
		return (await this.handCashConnectService.getLockedItems(params)).items;
	}

	/**
	 * Lock items
	 * @param {string} origin The origin of the item
	 * @returns {Promise<void>} A promise that resolves with the void.
	 */
	async lockItems(origin: string): Promise<void> {
		return this.handCashConnectService.lockItems(origin);
	}

	/**
	 * Unlock items
	 * @param {string} origin The origin of the item
	 * @returns {Promise<void>} A promise that resolves with the void.
	 */
	async unlockItems(origin: string): Promise<void> {
		return this.handCashConnectService.unlockItems(origin);
	}
}