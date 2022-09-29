const {
   PublicKey,
   PrivateKey,
   Networks,
   crypto,
} = require('bsv');

const { getUri } = require('axios');

const profileEndpoint = '/v1/connect/profile';
const accountEndpoint = '/v1/connect/account';
const walletEndpoint = '/v1/connect/wallet';
const runExtensionEndpoint = '/v1/connect/runExtension';

class HttpRequestFactory {
   constructor({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }) {
      if (authToken && !PrivateKey.isValid(authToken, Networks.livenet.toString())) {
         throw Error('Invalid authToken');
      }
      if (!appSecret) {
         throw Error('Missing appSecret');
      }
      if (!appId) {
         throw Error('Missing appId');
      }
      this.authToken = authToken;
      this.appSecret = appSecret;
      this.appId = appId;
      this.baseApiEndpoint = baseApiEndpoint;
      this.baseTrustholderEndpoint = baseTrustholderEndpoint;
   }

   _getRequest(method, endpoint, body = {}, queryParameters = false) {
      const timestamp = new Date().toISOString();
      const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
      const encodedEndpoint = HttpRequestFactory._getEncodedEndpoint(endpoint, queryParameters);
      const headers = {
         'app-id': this.appId,
         'app-secret': this.appSecret,
      };
      if (this.authToken) {
         const privateKey = PrivateKey.fromHex(this.authToken);
         const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
         headers['oauth-publickey'] = publicKey.toHex();
         headers['oauth-timestamp'] = timestamp.toString();
         headers['oauth-signature'] = HttpRequestFactory._getRequestSignature(method, encodedEndpoint, serializedBody,
            timestamp, privateKey);
      }
      return {
         baseURL: this.baseApiEndpoint,
         url: encodedEndpoint,
         method,
         headers,
         data: serializedBody,
         responseType: 'json',
      };
   }

   _getTrustholderRequest(method, endpoint, body, queryParameters){
      const encodedEndpoint = HttpRequestFactory._getEncodedEndpoint(endpoint, queryParameters);
      const headers = {};
      return {
         baseURL: this.baseTrustholderEndpoint,
         url: encodedEndpoint,
         method,
         headers,
         data: body,
         responseType: 'json',
      };
   }

   static _getEncodedEndpoint(endpoint, queryParameters) {
      return getUri({
         url: endpoint,
         params: queryParameters
      });
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

   getCurrentProfileRequest() {
      return this._getRequest(
         'GET',
         `${profileEndpoint}/currentUserProfile`,
      );
   }

   getPublicProfilesByHandleRequest(aliases) {
      return this._getRequest(
         'GET',
         `${profileEndpoint}/publicUserProfiles`,
         {},
         {
            'aliases': aliases,
         },
      );
   }

   requestEmailCodeRequest = (email) => this
      ._getRequest(
         'POST',
         `${accountEndpoint}/requestEmailCode`,
         {email},
      );

   verifyEmailCodeRequest = (requestId, verificationCode, publicKey) => this
      ._getTrustholderRequest(
         'POST',
         `/auth/verifyCode`,
         {requestId, verificationCode, publicKey}
      );

   createNewAccountRequest = (accessPublicKey, email, referrerAlias) => this
      ._getRequest(
         'POST',
         `${accountEndpoint}`,
         {accessPublicKey, email, referrerAlias}
      );

   getUserFriendsRequest() {
      return this._getRequest(
         'GET',
         `${profileEndpoint}/friends`,
      );
   }

   getUserPermissionsRequest() {
      return this._getRequest(
         'GET',
         `${profileEndpoint}/permissions`,
      );
   }

   getEncryptionKeypairRequest(encryptionPublicKey) {
      return this._getRequest(
         'GET',
         `${profileEndpoint}/encryptionKeypair`,
         {},
         {
            encryptionPublicKey,
         },
      );
   }

   getDataSignatureRequest(dataSignatureParameters) {
      return this._getRequest(
         'POST',
         `${profileEndpoint}/signData`,
         {
            format: dataSignatureParameters.format,
            value: dataSignatureParameters.value,
         },
      );
   }

   getSpendableBalanceRequest(currencyCode) {
      return this._getRequest(
         'GET',
         `${walletEndpoint}/spendableBalance`,
         {},
         currencyCode ? { currencyCode } : {},
      );
   }

   getTotalBalanceRequest() {
      return this._getRequest(
         'GET',
         `${walletEndpoint}/balance`,
      );
   }

   getPayRequest(paymentParameters) {
      return this._getRequest(
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

   getPaymentRequest(queryParameters) {
      return this._getRequest(
         'GET',
         `${walletEndpoint}/payment`,
         {},
         queryParameters,
      );
   }

   getExchangeRateRequest(currencyCode) {
      return this._getRequest(
         'GET',
         `${walletEndpoint}/exchangeRate/${currencyCode}`,
         {},
      );
   }

   getPursePayRequest(rawTransaction, inputParents) {
      return this._getRequest(
         'POST',
         `${runExtensionEndpoint}/purse/pay`,
         {
            rawTransaction,
            inputParents,
         },
      );
   }

   getPurseBroadcastRequest(rawTransaction) {
      return this._getRequest(
         'POST',
         `${runExtensionEndpoint}/purse/broadcast`,
         {
            rawTransaction,
         },
      );
   }

   getOwnerNextAddressRequest(alias) {
      return this._getRequest(
         'GET',
         `${runExtensionEndpoint}/owner/next`,
         {},
         {
            alias,
         },
      );
   }

   getOwnerSignRequest(rawTransaction, inputParents, locks) {
      return this._getRequest(
         'POST',
         `${runExtensionEndpoint}/owner/sign`,
         {
            rawTransaction,
            inputParents,
            locks,
         },
      );
   }

   getNftLocationsRequest() {
      return this._getRequest(
         'GET',
         `${runExtensionEndpoint}/owner/nftLocations`,
         {},
      );
   }
}

module.exports = HttpRequestFactory;
