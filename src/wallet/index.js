class Wallet {
   constructor(handCashConnectService) {
      this.handCashConnectService = handCashConnectService;
   }

   async getSpendableBalance(currencyCode) {
      return this.handCashConnectService.getSpendableBalance(currencyCode);
   }

   async getTotalBalance() {
      return this.handCashConnectService.getTotalBalance();
   }

   async pay(paymentParameters) {
      return this.handCashConnectService.pay(paymentParameters);
   }

   async getPayment(transactionId) {
      return this.handCashConnectService.getPayment(transactionId);
   }

   async getExchangeRate(currencyCode) {
      return this.handCashConnectService.getExchangeRate(currencyCode);
   }
}

module.exports = Wallet;
