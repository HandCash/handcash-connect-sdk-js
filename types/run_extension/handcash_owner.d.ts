export = HandCashOwner;
declare class HandCashOwner {
    static fromAuthToken(authToken: any, env?: {
        apiEndpoint: string;
        clientUrl: string;
    }, appSecret?: string): import("./handcash_owner");
    constructor(handCashConnectService: any);
    handCashConnectService: any;
    nextOwner(alias: any): Promise<any>;
    sign(rawTransaction: any, inputParents: any, locks: any): Promise<any>;
    getNftLocations(): Promise<any>;
}
