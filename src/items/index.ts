import HandCashConnectService from '../api/handcash_connect_service';
import { DestinationsWithOrigins, OrdinalItem, GetInventoryParameters } from '../types/items';

export default class Items {
	handCashConnectService: HandCashConnectService;

	constructor(handCashConnectService: HandCashConnectService) {
		this.handCashConnectService = handCashConnectService;
	}

	/**
	 * Get the items available in the user's inventory.
	 * See {@link https://docs.handcash.io/docs/list-user-ordinals} for more information.
	 *
	 *  @param {GetInventoryParameters} getInventoryParameters The destinations and origins of the items to send.
	 *
	 * @returns {Promise<OrdinalItem[]>} A promise that resolves with the user's inventory.
	 */
	async getInventory(getInventoryParameters: GetInventoryParameters): Promise<OrdinalItem[]> {
		return this.handCashConnectService.getInventory(getInventoryParameters).then((response) => response.items);
	}

	/**
	 * Send items to one or more destinations (handle or address).
	 * See {@link https://docs.handcash.io/docs/send-items} for more information.
	 *
	 * @param {DestinationsWithOrigins[]} destinationsWithOrigins The destinations and origins of the items to send.
	 *
	 * @returns {Promise<OrdinalItem>} A promise that resolves with the result of the payment.
	 */
	async sendItems(destinationsWithOrigins: DestinationsWithOrigins[]): Promise<OrdinalItem> {
		return this.handCashConnectService.sendItems({ destinationsWithOrigins });
	}
}
