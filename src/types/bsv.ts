import { z } from 'zod';

export type KeyPair = {
	privateKey: string;
	publicKey: string;
};

export const TxInputZ = z.object({
	satoshis: z.number().int(),
	script: z.string(),
});

export type TxInput = z.infer<typeof TxInputZ>;

export const TxLockZ = z.object({
	address: z.string(),
});

export type TxLock = z.infer<typeof TxLockZ>;
