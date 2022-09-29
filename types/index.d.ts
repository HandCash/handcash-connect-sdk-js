import HandCashConnect = require("../src/handcash_connect");
import HandCashConnectApiError = require("../src/api/handcash_connect_api_error");
import HandCashPurse = require("../src/run_extension/handcash_purse");
import HandCashOwner = require("../src/run_extension/handcash_owner");
import Permissions = require("./permissions");
import Environments = require("./environments");


declare interface Global {
   HandCashConnect: HandCashConnect;
   HandCashConnectApiError: HandCashConnectApiError;
   Permissions: Permissions;
   HandCashPurse: HandCashPurse;
   HandCashOwner: HandCashOwner;
   Environments: Environments.default;
}

export = Global;
