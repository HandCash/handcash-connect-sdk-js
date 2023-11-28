import HandCashConnect from './handcash_connect';
import HandCashPurse from './run_extension/handcash_purse';
import HandCashOwner from './run_extension/handcash_owner';
import HandCashConnectApiError from './api/handcash_connect_api_error';
import Environments from './environments';
import HandCashMinter from './handcash_minter';
import * as ItemTypes from './types/items';
import * as EventTypes from './types/events';
import * as PaymentTypes from './types/payments';

const Types = {
	...ItemTypes,
	...EventTypes,
	...PaymentTypes,
};

const Permissions = {
	Pay: 'PAY',
	UserPublicProfile: 'USER_PUBLIC_PROFILE',
	UserPrivateProfile: 'USER_PRIVATE_PROFILE',
	Friends: 'FRIENDS',
	Decryption: 'DECRYPTION',
	SignData: 'SIGN_DATA',
	ReadBalance: 'READ_BALANCE',
};

export {
	HandCashConnect,
	HandCashMinter,
	HandCashConnectApiError,
	Permissions,
	HandCashPurse,
	HandCashOwner,
	Environments,
	Types,
};
