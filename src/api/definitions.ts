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
import { CreateItemsOrder, ItemTransferResult, Item } from '../types/items';

type PathWithVariable<
	Prefix extends string,
	Variable extends string,
	Suffix extends string
> = `${Prefix}/${Variable}${Suffix}`;

type ListResponse<T> = {
	items: T[];
};

export type CloudResponse = {
	'/v1/connect/profile/currentUserProfile': UserProfile;
	'/v1/connect/profile/publicUserProfiles': ListResponse<UserPublicProfile>;
	'/v1/connect/profile/permissions': PermissionInfo;
	'/v1/connect/profile/encryptionKeypair': EncryptionKeypair;
	'/v1/connect/profile/signData': DataSignature;
	'/v1/connect/profile/friends': ListResponse<UserPublicProfile>;

	'/v1/connect/account': UserPublicProfile;
	'/v1/connect/account/requestEmailCode': { requestId: { requestId: string } };

	'/v1/connect/wallet/spendableBalance': SpendableBalance;
	'/v1/connect/wallet/balance': UserBalance;
	'/v1/connect/wallet/pay': PaymentResult;
	'/v1/connect/wallet/payment': PaymentResult;

	'/v1/connect/runExtension/purse/pay': { partiallySignedTx: string };
	'/v1/connect/runExtension/purse/broadcast': void;
	'/v1/connect/runExtension/owner/next': { ownerAddress: string };
	'/v1/connect/runExtension/owner/sign': { signedTransaction: string };
	'/v1/connect/runExtension/owner/nftLocations': { nftLocations: string[] };

	'/v3/wallet/items/inventory': ListResponse<Item>;
	'/v3/itemListing/list': ListResponse<Item>;
	'/v3/wallet/items/send': ItemTransferResult;
	'/v3/wallet/transactions/send/paymentRequest': PaymentResult;

	'/v3/itemCreationOrder': CreateItemsOrder;
	'/v3/itemCreationOrder/createBatch': CreateItemsOrder;
	'/v3/itemCreationOrder/issueItems': CreateItemsOrder;
} & {
	[K in PathWithVariable<'/v1/connect/wallet/exchangeRate', CurrencyCode, ''>]: ExchangeRate;
} & {
	[K in PathWithVariable<'/v3/itemCreationOrder', string, '/commit'>]: CreateItemsOrder;
} & {
	[K in PathWithVariable<'/v3/itemCreationOrder', string, '/add'>]: CreateItemsOrder;
} & {
	[K in PathWithVariable<'/v3/itemCreationOrder', string, ''>]: CreateItemsOrder;
} & {
	[K in PathWithVariable<'/v3/itemCreationOrder', string, '/items'>]: ListResponse<Item>;
};

export type CloudEndpoint = keyof CloudResponse;
