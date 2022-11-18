/* eslint-disable class-methods-use-this */
import Run from 'run-sdk';
import { Transaction } from 'bsv-wasm';
import { request } from 'undici';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class CustomBlockchain extends Run.plugins.WhatsOnChain {
	broadcast(rawTx: string) {
		return Transaction.from_hex(rawTx).get_id_hex();
	}

	async fetch(txid: string) {
		const url = `https://api.whatsonchain.com/v1/bsv/${this.network}/tx/${txid}/hex`;
		const { body } = await request(url);
		const data = await body.json();
		return data;
	}
}

export default CustomBlockchain;
