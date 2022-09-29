import HandCashConnectService = require("./api/handcash_connect_service");
import HandCashCloudAccount = require("./handcash_cloud_account");
import Environments = require("./environments");
import Entities = require("./entities");

declare class Params {
   appId: string;
   appSecret: string;
   env?: Environments.Environment;
}

export default class HandCashConnect {
   constructor(params: Params);

   appId: string;
   appSecret: string;
   env: Environments.Environment;
   handCashConnectService: HandCashConnectService;

   getRedirectionUrl(queryParameters?: {}): string;

   getChangeSpendLimitsUrl(redirectUrl?: boolean): string;

   generateRandomKeyPair: () => Entities.KeyPair;

   requestEmailCode(email: string): Promise<string>;

   verifyEmailCode(requestId: string, verificationCode: string, accessPublicKey: string): Promise<void>;

   createNewAccount(accessPublicKey: string, email: string, referrerAlias: string): Entities.UserPublicProfile;

   getAccountFromAuthToken(authToken: string): HandCashCloudAccount;
}
