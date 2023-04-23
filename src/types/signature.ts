export type DataSignature = {
	publicKey: string;
	signature: string;
};

export type DataSignatureParameters = {
	value: object | string;
	format: 'utf-8' | 'base64' | 'hex';
};
