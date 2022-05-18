export = Wallet;
declare class Wallet {
    constructor(handCashConnectService: any);
    handCashConnectService: any;
    getSpendableBalance(currencyCode: any): Promise<any>;
    getTotalBalance(): Promise<any>;
    pay(paymentParameters: any): Promise<any>;
    getPayment(transactionId: any): Promise<any>;
    getExchangeRate(currencyCode: any): Promise<any>;
}
