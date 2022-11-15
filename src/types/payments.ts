import { CurrencyCode } from './currencyCode';

type PaymentRequestItem = {
	destination: string;
	amount: number;
	tags?: [string];
};

type Attachment = {
	value: string | object;
	format: 'base64' | 'hex' | 'json';
};

type TransactionParticipant = {
	type: string;
	alias: string;
	displayName: number;
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
