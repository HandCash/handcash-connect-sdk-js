import { ItemTransfer } from './items.js';

export interface WebhookPayload {
	event: 'item_listing_payment_completed' | 'items_transferred';
	applicationId: string;
	apiVersion: string;
	created: string;
}

export interface ItemListingPaymentCompletedEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'item_listing_payment_completed';
	data: ItemTransfer;
}

export interface ItemsTransferredEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'items_transferred';
	data: ItemTransfer;
}
