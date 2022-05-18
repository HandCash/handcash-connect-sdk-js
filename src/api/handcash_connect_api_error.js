class HandCashConnectApiError extends Error {
   constructor(httpStatusCode, message, info) {
      super();
      this.httpStatusCode = httpStatusCode;
      this.message = message;
      this.info = info;
   }

   toString() {
      return JSON.stringify(this);
   }
}

module.exports = HandCashConnectApiError;
