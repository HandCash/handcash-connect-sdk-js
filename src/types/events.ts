import { ItemTransfer, Item, CreateItemsOrder } from './items.js';

export interface WebhookPayload {
	event: 'item_listing_payment_completed' | 'items_transferred' | 'item_creation_order_completed';
	applicationId: string;
	apiVersion: string;
	created: string;
}

export interface ItemListingPaymentCompletedEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'item_listing_payment_completed';
	data: {
		itemTransfer: ItemTransfer;
	};
}

export interface ItemsTransferredEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'items_transferred';
	data: {
		itemTransfer: ItemTransfer;
	};
}

export interface ItemCreationEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'item_creation_order_completed';
	data: {
		items: Item[];
		itemCreationOrder: CreateItemsOrder;
	};
}
