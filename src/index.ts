import HandCashConnect from './handcash_connect';
import HandCashPurse from './run_extension/handcash_purse';
import HandCashOwner from './run_extension/handcash_owner';
import HandCashConnectApiError from './api/handcash_connect_api_error';
import Environments from './environments';

const permissions = {
	Pay: 'PAY',
	UserPublicProfile: 'USER_PUBLIC_PROFILE',
	UserPrivateProfile: 'USER_PRIVATE_PROFILE',
	Friends: 'FRIENDS',
	Decryption: 'DECRYPTION',
	SignData: 'SIGN_DATA',
	ReadBalance: 'READ_BALANCE',
};

const sdk = {
	HandCashConnect,
	HandCashConnectApiError,
	Permissions: permissions,
	HandCashPurse,
	HandCashOwner,
	Environments,
};

export default sdk;
