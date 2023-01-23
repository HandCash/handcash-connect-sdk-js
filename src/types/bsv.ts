export type KeyPair = {
	privateKey: string;
	publicKey: string;
};

export type TxInput = {
	satoshis: number;
	script: string;
};

export type TxLock = {
	address: string;
};
