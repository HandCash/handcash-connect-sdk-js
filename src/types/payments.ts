import { CurrencyCode } from './currencyCode';

export type PaymentRequestItem = {
	destination: string;
	amount: number;
	tags?: string[];
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
	type: string;
	alias: string;
	displayName: string;
	profilePictureUrl: string;
	tags: string[];
};

type Currency = {
	code: CurrencyCode;
	logoUrl: string;
	symbol: string;
};

export type PaymentResult = {
	transactionId: string;
	note: string;
	time: number;
	type: string;
	units: number;
	currency: Currency;
	participants: TransactionParticipant[];
	attachments: Attachment[];
};

export type PaymentParameters = {
	note?: string;
	currencyCode: CurrencyCode;
	receivers: PaymentRequestItem[];
	attachment?: Attachment;
};
