import Wallet = require("./wallet");
import Profile = require("./profile");

declare class Params {
   authToken: string;
   appSecret: string;
   appId: string;
   baseApiEndpoint: string;
   baseTrustholderEndpoint: string;
}

declare class HandCashCloudAccount {
   static fromAuthToken(params: Params): HandCashCloudAccount;

   constructor(wallet: Wallet, profile: Profile);

   wallet: Wallet;
   profile: Profile;
}

export = HandCashCloudAccount;
