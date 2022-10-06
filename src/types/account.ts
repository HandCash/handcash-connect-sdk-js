export type ExchangeRate = {
	fiatSymbol: string;
	rate: number;
	exchangeRateVersion: string;
	estimatedExpireDate: string;
};

export type SpendableBalance = {
	spendableSatoshiBalance: number;
	spendableFiatBalance: number;
	currencyCode: string;
};

export type UserBalance = {
	satoshiBalance: number;
	fiatBalance: number;
	currencyCode: string;
};

export type UserPublicProfile = {
	id: string;
	handle: string;
	paymail: string;
	displayName: string;
	avatarUrl: string;
	localCurrencyCode: string;
	bitcoinUnit: string;
	createdAt: Date;
};

export type UserPrivateProfile = {
	phoneNumber: string;
	email: string;
};

export type UserProfile = {
	publicProfile: UserPublicProfile;
	privateProfile: UserPrivateProfile;
};

export enum Permissions {
	Pay = 'PAY',
	UserPublicProfile = 'USER_PUBLIC_PROFILE',
	UserPrivateProfile = 'USER_PRIVATE_PROFILE',
	Friends = 'FRIENDS',
	Decryption = 'DECRYPTION',
	SignData = 'SIGN_DATA',
	ReadBalance = 'READ_BALANCE',
}
