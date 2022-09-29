import Environments = require("../environments");
import HandCashConnectService = require("../api/handcash_connect_service");

declare class HandCashPurse {
   static fromAuthToken(authToken: string, env?: Environments.Environment, appSecret?: string): HandCashPurse;

   constructor(handCashConnectService: HandCashConnectService);

   handCashConnectService: HandCashConnectService;

   pay(rawTx: string, parents: any[]): Promise<any>;

   broadcast(rawTx: string): Promise<void>;
}

export = HandCashPurse;
