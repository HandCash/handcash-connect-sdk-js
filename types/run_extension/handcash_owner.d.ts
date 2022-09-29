import Environment = require("../environments");

declare class HandCashOwner {
   static fromAuthToken(authToken: any, env?: Environment.Environment, appSecret?: string): HandCashOwner;

   constructor(handCashConnectService: any);

   handCashConnectService: any;

   nextOwner(alias: string): Promise<string>;

   sign(rawTransaction: string, inputParents: any[], locks: any[]): Promise<string>;

   getNftLocations(): Promise<string[]>;
}

export = HandCashOwner;
