import { OrdinalItem, ItemTransferResult } from './items.js';
import { PaymentResult } from './payments.js';

export interface WebhookPayload {
	event: 'item_listing_payment_completed' | 'items_transferred';
	applicationId: string;
	apiVersion: string;
	created: string;
	data: Date;
}

export interface ItemListingPaymentCompletedEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'item_listing_payment_completed';
	data: {
		transactionRecord: PaymentResult;
		items: OrdinalItem[];
		itemTransfer: ItemTransferResult;
	};
}

export interface ItemsTransferredEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'items_transferred';
	data: {
		itemTransfer: ItemTransferResult;
	};
}
