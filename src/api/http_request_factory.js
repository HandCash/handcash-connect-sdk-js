const { PublicKey, PrivateKey, Networks, crypto } = require('bsv');
const profileEndpoint = '/v1/connect/profile';
const walletEndpoint = '/v1/connect/wallet';
const runExtensionEndpoint = '/v1/connect/runExtension';

/**
 * @class
 */
class HttpRequestFactory {
   /**
    * @param {string} authToken
    * @param {string} baseApiEndpoint
    * @param {string} [appSecret]
    */
   constructor(authToken, baseApiEndpoint, appSecret) {
      if (!authToken) {
         throw Error('Missing authToken');
      }
      if (!PrivateKey.isValid(authToken, Networks.livenet.toString())) {
         throw Error('Invalid authToken');
      }
      this.authToken = authToken;
      this.appSecret = appSecret;
      this.baseApiEndpoint = baseApiEndpoint;
   }

   _getSignedRequest(method, endpoint, body = {}) {
      const timestamp = new Date().toISOString();
      const privateKey = PrivateKey.fromHex(this.authToken);
      const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
      const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
      const headers = {
         'oauth-publickey': publicKey.toHex(),
         'oauth-signature': HttpRequestFactory._getRequestSignature(method, endpoint, serializedBody,
            timestamp, privateKey),
         'oauth-timestamp': timestamp.toString(),
      };
      if (endpoint.indexOf(runExtensionEndpoint) !== -1) {
         headers['app-secret'] = this.appSecret;
      }
      return {
         baseURL: this.baseApiEndpoint,
         url: endpoint,
         method,
         headers,
         data: serializedBody,
         responseType: 'json',
      };
   }

   static _getRequestSignature(method, endpoint, serializedBody, timestamp, privateKey) {
      const signaturePayload = HttpRequestFactory._getRequestSignaturePayload(method, endpoint,
         serializedBody, timestamp);
      const hash = crypto.Hash.sha256(Buffer.from(signaturePayload));
      return crypto.ECDSA.sign(hash, privateKey)
         .toString();
   }

   static _getRequestSignaturePayload(method, endpoint, serializedBody, timestamp) {
      return `${method}\n${endpoint}\n${timestamp}\n${serializedBody}`;
   }

   /**
    * @return {Object}
    */
   getCurrentProfileRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/currentUserProfile`,
      );
   }

   /**
    * @param {Array<String>} aliases
    * @return {Object}
    */
   getPublicProfilesByHandleRequest(aliases) {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/publicUserProfiles`,
         {
            aliases,
         },
      );
   }

   /**
    * @return {Object}
    */
   getUserFriendsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/friends`,
      );
   }

   /**
    * @return {Object}
    */
   getUserPermissionsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/permissions`,
      );
   }

   /**
    * @param {String} encryptionPublicKey
    * @return {Object}
    */
   getEncryptionKeypairRequest(encryptionPublicKey) {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/encryptionKeypair`,
         {
            encryptionPublicKey,
         },
      );
   }

   /**
    * @param {Object} dataSignatureParameters
    * @param {Object} dataSignatureParameters.value
    * @param {Object} dataSignatureParameters.format
    * @return {Object}
    */
   getDataSignatureRequest(dataSignatureParameters) {
      return this._getSignedRequest(
         'POST',
         `${profileEndpoint}/signData`,
         {
            format: dataSignatureParameters.format,
            value: dataSignatureParameters.value,
         },
      );
   }

   /**
    * @param {String} currencyCode
    * @return {Object}
    */
   getSpendableBalanceRequest(currencyCode) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/spendableBalance`,
         {
            currencyCode,
         },
      );
   }

   /**
    * @param {Object} paymentParameters
    * @param {Object} paymentParameters.payments
    * @param {Object} paymentParameters.attachment
    * @param {String} paymentParameters.description
    * @param {String} paymentParameters.appAction
    * @return {Object}
    */
   getPayRequest(paymentParameters) {
      return this._getSignedRequest(
         'POST',
         `${walletEndpoint}/pay`,
         {
            description: paymentParameters.description,
            appAction: paymentParameters.appAction,
            receivers: paymentParameters.payments,
            attachment: paymentParameters.attachment,
         },
      );
   }

   /**
    * @param {Object} queryParameters
    * @param {Object} queryParameters.transactionId
    * @return {Object}
    */
   getPaymentRequest(queryParameters) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/payment`,
         queryParameters,
      );
   }

   /**
    * @param {string} currencyCode
    * @return {Object}
    */
   getExchangeRateRequest(currencyCode) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/exchangeRate/${currencyCode}`,
         {},
      );
   }

   /**
    * @param {string} rawTransaction
    * @param {Array} inputParents
    * @return {Object}
    */
   getPursePayRequest(rawTransaction, inputParents) {
      return this._getSignedRequest(
         'POST',
         `${runExtensionEndpoint}/purse/pay`,
         {
            rawTransaction,
            inputParents,
         },
      );
   }

   /**
    * @param {string} rawTransaction
    * @return {Object}
    */
   getPurseBroadcastRequest(rawTransaction) {
      return this._getSignedRequest(
         'POST',
         `${runExtensionEndpoint}/purse/broadcast`,
         {
            rawTransaction,
         },
      );
   }

   /**
    * @param {string} alias
    * @return {Object}
    */
   getOwnerNextAddressRequest(alias) {
      return this._getSignedRequest(
         'GET',
         `${runExtensionEndpoint}/owner/next`,
         {
            alias,
         },
      );
   }

   /**
    * @param {string} rawTransaction
    * @param {Array<Object>} inputParents
    * @param {Array<Object>} locks
    * @return {Object}
    */
   getOwnerSignRequest(rawTransaction, inputParents, locks) {
      return this._getSignedRequest(
         'POST',
         `${runExtensionEndpoint}/owner/sign`,
         {
            rawTransaction,
            inputParents,
            locks,
         },
      );
   }
}

module.exports = HttpRequestFactory;
