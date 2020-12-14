const { PublicKey, PrivateKey, crypto } = require('bsv');

const profileEndpoint = '/v1/connect/profile';
const walletEndpoint = '/v1/connect/wallet';

module.exports = class HttpRequestFactory {
   /**
    * @param {string} authToken
    * @param {string} baseApiEndpoint
    */
   constructor(authToken, baseApiEndpoint) {
      this.authToken = authToken;
      this.baseApiEndpoint = baseApiEndpoint;
   }

   _getSignedRequest(method, endpoint, body = {}) {
      const timestamp = new Date().toISOString();
      const privateKey = PrivateKey.fromHex(this.authToken);
      const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
      return {
         baseURL: this.baseApiEndpoint,
         url: endpoint,
         method,
         data: body,
         headers: {
            'oauth-publickey': publicKey.toHex(),
            'oauth-signature': HttpRequestFactory._getRequestSignature(method, endpoint, body, timestamp, privateKey),
            'oauth-timestamp': timestamp.toString(),
         },
         responseType: 'json',
      };
   }

   static _getRequestSignature(method, endpoint, body, timestamp, privateKey) {
      const signatureHash = HttpRequestFactory._getRequestSignatureHash(method, endpoint, body, timestamp);
      const hash = crypto.Hash.sha256(Buffer.from(signatureHash));
      return crypto.ECDSA.sign(hash, privateKey)
         .toString();
   }

   static _getRequestSignatureHash(method, endpoint, body, timestamp) {
      return `${method}\n${endpoint}\n${timestamp}\n${JSON.stringify(body)}`;
   }

   /**
    * @returns {Object}
    */
   getCurrentProfileRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/currentUserProfile`,
      );
   }

   /**
    * @param {Array<String>} aliases
    * @returns {Object}
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
    * @returns {Object}
    */
   getUserFriendsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/friends`,
      );
   }

   /**
    * @returns {Object}
    */
   getUserPermissionsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/permissions`,
      );
   }

   /**
    * @param {String} encryptionPublicKey
    * @returns {Object}
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
    * @returns {Object}
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
    * @returns {Object}
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
    * @returns {Object}
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
    * @returns {Object}
    */
   getPaymentRequest(queryParameters) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/payment`,
         queryParameters,
      );
   }
};
