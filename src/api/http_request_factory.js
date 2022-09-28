const {
   PublicKey,
   PrivateKey,
   Networks,
   crypto,
} = require('bsv');

const profileEndpoint = '/v1/connect/profile';
const accountEndpoint = '/v1/connect/account';
const walletEndpoint = '/v1/connect/wallet';
const runExtensionEndpoint = '/v1/connect/runExtension';

class HttpRequestFactory {
   constructor(authToken, baseApiEndpoint, baseTrustholderEndpoint, appSecret, appId) {
      if (!authToken) {
         throw Error('Missing authToken');
      }
      if (!PrivateKey.isValid(authToken, Networks.livenet.toString())) {
         throw Error('Invalid authToken');
      }
      if (!appSecret) {
         throw Error('Missing appSecret');
      }
      this.authToken = authToken;
      this.appSecret = appSecret;
      this.appId = appId;
      this.baseApiEndpoint = baseApiEndpoint;
      this.baseTrustholderEndpoint = baseTrustholderEndpoint;
   }

   _getSignedRequest(method, endpoint, body = {}, queryParameters = false) {
      const timestamp = new Date().toISOString();
      const privateKey = PrivateKey.fromHex(this.authToken);
      const publicKey = PublicKey.fromPoint(PublicKey.fromPrivateKey(privateKey).point, true);
      const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
      const encodedEndpoint = HttpRequestFactory._getEncodedEndpoint(endpoint, queryParameters);
      const headers = {
         'oauth-publickey': publicKey.toHex(),
         'oauth-signature': HttpRequestFactory._getRequestSignature(method, encodedEndpoint, serializedBody,
            timestamp, privateKey),
         'oauth-timestamp': timestamp.toString(),
         'app-id': this.appId,
         'app-secret': this.appSecret,
      };
      return {
         baseURL: this.baseApiEndpoint,
         url: encodedEndpoint,
         method,
         headers,
         data: serializedBody,
         responseType: 'json',
      };
   }

   _getAuthenticatedRequest(method, endpoint, body = {}, queryParameters){
      const encodedEndpoint = HttpRequestFactory._getEncodedEndpoint(endpoint, queryParameters);
      const headers = {
         'app-id': this.appId,
         'app-secret': this.appSecret,
      };
      return {
         baseURL: this.baseApiEndpoint,
         url: encodedEndpoint,
         method,
         headers,
         data: body,
         responseType: 'json',
      };
   }

   _getTrustholderRequest(method, endpoint, body = {}, queryParameters){
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
      if (!queryParameters) {
         return endpoint;
      }
      return `${endpoint}?${new URLSearchParams(queryParameters).toString()}`;
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
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/currentUserProfile`,
      );
   }

   getPublicProfilesByHandleRequest(aliases) {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/publicUserProfiles`,
         {},
         {
            'aliases[]': aliases,
         },
      );
   }

   requestEmailCodeRequest = (email) => this
      ._getAuthenticatedRequest(
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
      ._getAuthenticatedRequest(
         'POST',
         `${accountEndpoint}`,
         {accessPublicKey, email, referrerAlias}
      );

   getUserFriendsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/friends`,
      );
   }

   getUserPermissionsRequest() {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/permissions`,
      );
   }

   getEncryptionKeypairRequest(encryptionPublicKey) {
      return this._getSignedRequest(
         'GET',
         `${profileEndpoint}/encryptionKeypair`,
         {},
         {
            encryptionPublicKey,
         },
      );
   }

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

   getSpendableBalanceRequest(currencyCode) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/spendableBalance`,
         {},
         currencyCode ? { currencyCode } : {},
      );
   }

   getTotalBalanceRequest() {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/balance`,
      );
   }

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

   getPaymentRequest(queryParameters) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/payment`,
         {},
         queryParameters,
      );
   }

   getExchangeRateRequest(currencyCode) {
      return this._getSignedRequest(
         'GET',
         `${walletEndpoint}/exchangeRate/${currencyCode}`,
         {},
      );
   }

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

   getPurseBroadcastRequest(rawTransaction) {
      return this._getSignedRequest(
         'POST',
         `${runExtensionEndpoint}/purse/broadcast`,
         {
            rawTransaction,
         },
      );
   }

   getOwnerNextAddressRequest(alias) {
      return this._getSignedRequest(
         'GET',
         `${runExtensionEndpoint}/owner/next`,
         {},
         {
            alias,
         },
      );
   }

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

   getNftLocationsRequest() {
      return this._getSignedRequest(
         'GET',
         `${runExtensionEndpoint}/owner/nftLocations`,
         {},
      );
   }
}

module.exports = HttpRequestFactory;
