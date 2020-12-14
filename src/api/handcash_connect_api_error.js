module.exports = class HandCashConnectApiError extends Error {
   /**
    * @param {number} httpStatusCode
    * @param {string} message
    * @param {Object} info
    */
   constructor(httpStatusCode, message, info) {
      super();
      this.httpStatusCode = httpStatusCode;
      this.message = message;
      this.info = info;
   }

   toString() {
      return JSON.stringify(this);
   }
};
