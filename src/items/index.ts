import HandCashConnectService from '../api/handcash_connect_service';
import { GetItemsParameters, OrdinalItem } from '../types/items';

export default class Items {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 * Get the items available in the user's inventory.
	 * See {@link https://docs.handcash.io/docs/user-inventory} for more information.
	 *
	 *  @param {GetItemsParameters} getItemsParameters Defines the parameters to filter items
	 *
	 * @returns {Promise<OrdinalItem[]>} A promise that resolves with a list of ordinals from the user inventory.
	 */
	async getItemsInventory(getItemsParameters: GetItemsParameters): Promise<OrdinalItem[]> {
		return this.handCashConnectService.getItemsInventory(getItemsParameters).then((response) => response.items);
	}

	/**
	 * Get the items listed for sale by the user.
	 * See {@link https://docs.handcash.io/docs/user-listings} for more information.
	 *
	 * @param {GetItemsParameters} getItemsParameters Defines the parameters to filter items
	 *
	 * @returns {Promise<OrdinalItem[]>} A promise that resolves with a list of ordinals listed by the user.
	 */
	async getItemListings(getItemsParameters: GetItemsParameters): Promise<OrdinalItem[]> {
		return this.handCashConnectService.getItemListings(getItemsParameters).then((response) => response.items);
	}
}
