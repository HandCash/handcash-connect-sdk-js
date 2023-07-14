import {
	EncryptionKeypair,
	ExchangeRate,
	PermissionInfo,
	SpendableBalance,
	UserBalance,
	UserProfile,
	UserPublicProfile,
} from '../types/account';
import { CurrencyCode } from '../types/currencyCode';
import { PaymentResult } from '../types/payments';
import { DataSignature } from '../types/signature';
import { OrdinalItem } from '../types/items';

type PathWithVariable<Prefix extends string, Variable extends string> = `${Prefix}/${Variable}`;

type Items<T> = {
	items: T[];
};

export type CloudResponse = {
	'/v1/connect/profile/currentUserProfile': UserProfile;
	'/v1/connect/profile/publicUserProfiles': Items<UserPublicProfile>;
	'/v1/connect/profile/permissions': PermissionInfo;
	'/v1/connect/profile/encryptionKeypair': EncryptionKeypair;
	'/v1/connect/profile/signData': DataSignature;
	'/v1/connect/profile/friends': Items<UserPublicProfile>;

	'/v1/connect/account': UserPublicProfile;
	'/v1/connect/account/requestEmailCode': { requestId: { requestId: string } };

	'/v1/connect/wallet/spendableBalance': SpendableBalance;
	'/v1/connect/wallet/balance': UserBalance;
	'/v1/connect/wallet/pay': PaymentResult;
	'/v1/connect/wallet/payment': PaymentResult;

	'/v1/connect/runExtension/purse/pay': string;
	'/v1/connect/runExtension/purse/broadcast': void;
	'/v1/connect/runExtension/owner/next': { ownerAddress: string };
	'/v1/connect/runExtension/owner/sign': { signedTransaction: string };
	'/v1/connect/runExtension/owner/nftLocations': { nftLocations: string[] };

	'/v3/wallet/items/inventory': Items<OrdinalItem>;
	'/v3/wallet/items/send': OrdinalItem;
} & {
	[K in PathWithVariable<'/v1/connect/wallet/exchangeRate', CurrencyCode>]: ExchangeRate;
};

export type CloudEndpoint = keyof CloudResponse;
