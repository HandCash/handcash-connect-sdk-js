const HandCashConnect = require('./handcash_connect');
const HandCashPurse = require('./run_extension/handcash_purse');
const HandCashOwner = require('./run_extension/handcash_owner');
const HandCashConnectApiError = require('./api/handcash_connect_api_error');
const Environments = require('./environments');

const permissions = {
   Pay: 'PAY',
   UserPublicProfile: 'USER_PUBLIC_PROFILE',
   UserPrivateProfile: 'USER_PRIVATE_PROFILE',
   Friends: 'FRIENDS',
   Decryption: 'DECRYPTION',
   SignData: 'SIGN_DATA',
   ReadBalance: 'READ_BALANCE',
};

const sdk = module.exports;
sdk.HandCashConnect = HandCashConnect;
sdk.HandCashConnectApiError = HandCashConnectApiError;
sdk.Permissions = permissions;
sdk.HandCashPurse = HandCashPurse;
sdk.HandCashOwner = HandCashOwner;
sdk.Environments = Environments;
