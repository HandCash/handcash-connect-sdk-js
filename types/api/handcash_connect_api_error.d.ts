declare class HandCashConnectApiError extends Error {
   constructor(httpStatusCode: number, message: string, info: string);

   httpStatusCode: number;
   message: string;
   info: string;
}

export = HandCashConnectApiError;
