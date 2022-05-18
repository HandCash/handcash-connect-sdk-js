export = HandCashPurse;
declare class HandCashPurse {
    static fromAuthToken(authToken: any, env?: {
        apiEndpoint: string;
        clientUrl: string;
    }, appSecret?: string): import("./handcash_purse");
    constructor(handCashConnectService: any);
    handCashConnectService: any;
    pay(rawTx: any, parents: any): Promise<any>;
    broadcast(rawTx: any): Promise<void>;
}
