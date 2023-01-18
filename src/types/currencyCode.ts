import { z } from 'zod';

export const CurrencyCodeZ = z.enum([
	'BSV',
	'ARS',
	'AUD',
	'BRL',
	'CAD',
	'CHF',
	'CNY',
	'COP',
	'CZK',
	'DKK',
	'EUR',
	'GBP',
	'HKD',
	'JPY',
	'KRW',
	'MXN',
	'NOK',
	'NZD',
	'PHP',
	'RUB',
	'SAT',
	'SEK',
	'SGD',
	'THB',
	'USD',
	'ZAR',
]);

export type CurrencyCode = z.infer<typeof CurrencyCodeZ>;
