import { z } from 'zod';
import { JsonSchemaZ } from './http';

export type DataSignature = {
	publicKey: string;
	signature: string;
};

export const DataSignatureParametersZ = z.object({
	value: JsonSchemaZ,
	format: z.enum(['utf-8', 'base64', 'hex']),
});

export type DataSignatureParameters = z.infer<typeof DataSignatureParametersZ>;
