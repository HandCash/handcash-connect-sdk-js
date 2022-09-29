declare class HandCashConnectService {
   static handleRequest(requestParameters: any): Promise<any>;

   static handleApiError(errorResponse: any): Promise<never>;

   constructor(httpRequestFactory: any);

   httpRequestFactory: any;

   getCurrentProfile(): Promise<any>;

   getPublicProfilesByHandle(handles: any): Promise<any>;

   getUserPermissions(): Promise<any>;

   getEncryptionKeypair(encryptionPublicKey: any): Promise<any>;

   signData(dataSignatureParameters: any): Promise<any>;

   getUserFriends(): Promise<any>;

   getSpendableBalance(currencyCode: any): Promise<any>;

   getTotalBalance(): Promise<any>;

   pay(paymentParameters: any): Promise<any>;

   getPayment(transactionId: any): Promise<any>;

   getExchangeRate(currencyCode: any): Promise<any>;

   pursePay(rawTransaction: any, parents: any): Promise<any>;

   purseBroadcast(rawTransaction: any): Promise<any>;

   ownerNextAddress(alias: any): Promise<any>;

   ownerSign(rawTransaction: any, inputParents: any, locks: any): Promise<any>;

   getNftLocations(): Promise<any>;
}

export = HandCashConnectService;
