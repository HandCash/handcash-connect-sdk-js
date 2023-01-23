import { CurrencyCode } from './currencyCode';
import { Json } from './http';

export type PaymentRequestItem = {
	destination: string;
	currencyCode: CurrencyCode;
	sendAmount: number;
	tags?: string[];
};

export type Attachment = {
	value: Json;
	format: 'base64' | 'hex' | 'json';
};

export type TransactionParticipant = {
	type: string;
	alias: string;
	displayName: string;
	profilePictureUrl: string;
	tags: string[];
};

export type PaymentResult = {
	transactionId: string;
	note: string;
	appAction: string;
	time: number;
	type: string;
	satoshiFees: number;
	satoshiAmount: number;
	fiatExchangeRate: number;
	fiatCurrencyCode: CurrencyCode;
	participants: TransactionParticipant[];
	attachments: Attachment[];
	rawTransactionHex: string;
};

export type PaymentParameters = {
	description?: string;
	appAction?: string;
	payments: PaymentRequestItem[];
	attachment?: Attachment;
};
