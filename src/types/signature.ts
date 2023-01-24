import { Json } from './http';

export type DataSignature = {
	publicKey: string;
	signature: string;
};

export type DataSignatureParameters = {
	value: Json;
	format: 'utf-8' | 'base64' | 'hex';
};
