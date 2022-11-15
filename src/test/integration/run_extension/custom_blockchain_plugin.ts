/* eslint-disable class-methods-use-this */
import Run from 'run-sdk';
import bsv from 'bsv';
import axios from 'axios';

class CustomBlockchain extends Run.plugins.WhatsOnChain {
   broadcast(rawTx: String) {
      return bsv.Transaction(rawTx).hash
   }

   async fetch(txid: String) {
      const url = `https://api.whatsonchain.com/v1/bsv/${this.network}/tx/${txid}/hex`;
      const res = await axios.get(url);
      return res.data;
   }
}

export default CustomBlockchain;