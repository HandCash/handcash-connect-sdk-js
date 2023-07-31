import HandCashConnectService from './api/handcash_connect_service';
import Wallet from './wallet';
import Profile from './profile';
import Items from './items';

type Params = {
	authToken: string;
	appSecret: string;
	appId: string;
	baseApiEndpoint: string;
	baseTrustholderEndpoint: string;
};

export default class HandCashCloudAccount {
	wallet: Wallet;

	profile: Profile;

	items: Items;

	constructor(wallet: Wallet, profile: Profile, items: Items) {
		this.wallet = wallet;
		this.profile = profile;
		this.items = items;
	}

	static fromAuthToken({ authToken, appSecret, appId, baseApiEndpoint, baseTrustholderEndpoint }: Params) {
		if (!appSecret) {
			throw Error('Missing appSecret');
		}
		const handCashConnectService = new HandCashConnectService({
			authToken,
			baseApiEndpoint,
			baseTrustholderEndpoint,
			appSecret,
			appId,
		});
		const wallet = new Wallet(handCashConnectService);
		const profile = new Profile(handCashConnectService);
		const items = new Items(handCashConnectService);
		return new HandCashCloudAccount(wallet, profile, items);
	}
}
