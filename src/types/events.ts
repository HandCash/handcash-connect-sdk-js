import { ItemPackOrder, OrdinalItem, ItemTransferResult } from './items.js';
import { PaymentResult } from './payments.js';

export interface WebhookPayload {
	event: 'item_pack_sell' | 'item_listing_payment_completed' | 'items_inscribed' | 'items_transferred';
	applicationId: string;
	apiVersion: string;
	created: string;
	data: Date;
}

export interface ItemPackSoldEvent extends Omit<WebhookPayload, 'data'> {
	event: 'item_pack_sell';
	data: {
		itemPackOrder: ItemPackOrder;
		transactionRecord?: PaymentResult;
	};
}

export interface ItemListingPaymentCompletedEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'item_listing_payment_completed';
	data: {
		transactionRecord: PaymentResult;
		items: OrdinalItem[];
		itemTransfer: ItemTransferResult;
	};
}

export interface ItemsInscribedEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'items_inscribed';
	data: {
		itemPackOrder: ItemPackOrder;
	};
}

export interface ItemsTransferredEventPayload extends Omit<WebhookPayload, 'data'> {
	event: 'items_transferred';
	data: {
		itemTransfer: ItemTransferResult;
	};
}
