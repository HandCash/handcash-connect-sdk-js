import { z } from 'zod';
import { CurrencyCodeZ } from './currencyCode';
import { JsonSchemaZ } from './http';

const PaymentRequestItemZ = z.object({
	destination: z.string(),
	currencyCode: CurrencyCodeZ,
	sendAmount: z.number(),
	tags: z.array(z.string()).optional(),
});

export type PaymentRequestItem = z.infer<typeof PaymentRequestItemZ>;

const AttachmentZ = z.object({
	value: JsonSchemaZ,
	format: z.enum(['base64', 'hex', 'json']),
});

export type Attachment = z.infer<typeof AttachmentZ>;

const TransactionParticipantZ = z.object({
	type: z.string(),
	alias: z.string(),
	displayName: z.string(),
	profilePictureUrl: z.string(),
	tags: z.array(z.string()),
});

export type TransactionParticipant = z.infer<typeof TransactionParticipantZ>;

const PaymentResultZ = z.object({
	transactionId: z.string(),
	note: z.string(),
	appAction: z.string(),
	time: z.number(),
	type: z.string(),
	satoshiFees: z.number().int(),
	satoshiAmount: z.number().int(),
	fiatExchangeRate: z.number(),
	fiatCurrencyCode: CurrencyCodeZ,
	participants: z.array(TransactionParticipantZ),
	attachments: z.array(AttachmentZ),
	rawTransactionHex: z.string(),
});

export type PaymentResult = z.infer<typeof PaymentResultZ>;

export const PaymentParametersZ = z.object({
	description: z.string().optional(),
	appAction: z.string().optional(),
	payments: z.array(PaymentRequestItemZ),
	attachment: AttachmentZ.optional(),
});

export type PaymentParameters = z.infer<typeof PaymentParametersZ>;
