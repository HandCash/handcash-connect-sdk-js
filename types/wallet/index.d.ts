import Entities = require("../entities");
import HandCashConnectService = require("../api/handcash_connect_service");


declare class Wallet {
   constructor(handCashConnectService: HandCashConnectService);

   handCashConnectService: HandCashConnectService;

   getSpendableBalance(currencyCode: Entities.CurrencyCode): Promise<Entities.SpendableBalance>;

   getTotalBalance(): Promise<Entities.UserBalance>;

   pay(paymentParameters: Entities.PaymentParameters): Promise<Entities.PaymentResult>;

   getPayment(transactionId: string): Promise<Entities.PaymentResult>;

   getExchangeRate(currencyCode: Entities.CurrencyCode): Promise<Entities.ExchangeRate>;
}

export = Wallet;
