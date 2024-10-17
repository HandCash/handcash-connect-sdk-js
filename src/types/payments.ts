import { CurrencyCode } from './currencyCode';

export type PaymentRequestItem = {
	destination: string;
	currencyCode: CurrencyCode;
	sendAmount: number;
	tags?: [];
};

type JsonAttachment = {
	value: object;
	format: 'json';
};

type HexOrBase64Attachment = {
	value: string;
	format: 'hex';
};

export type Attachment = JsonAttachment | HexOrBase64Attachment;

export type TransactionParticipant = {
	id: string;
	type: string;
	alias: string;
	displayName: number;
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

export type DepositAddress = {
	base58Address: string;
};
