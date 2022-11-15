export type DataSignature = {
	publicKey: string;
	signature: string;
};

export type DataSignatureParameters = {
	value: string | object;
	format: 'hex' | 'base64' | 'utf-8';
};
