export = HandCashConnectApiError;
declare class HandCashConnectApiError extends Error {
    constructor(httpStatusCode: any, message: any, info: any);
    httpStatusCode: any;
    message: any;
    info: any;
}
