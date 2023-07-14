export type OrdinalItemAttribute = {
	name: string;
	value: any;
	displayType: 'string' | 'number' | 'date' | 'boostPercentage' | 'boostNumber';
};

export type OrdinalItem = {
	origin: string;
	name: string;
	description: string;
	imageUrl: string;
	multimediaUrl: string;
	multimediaType: string;
	rarity: '';
	color: string;
	attributes: OrdinalItemAttribute[];
	collection: {
		id: string;
		description: string;
		app: {
			id: string;
			name: string;
			iconUrl: string;
		};
		origin: string;
		name: string;
		imageUrl: string;
		totalQuantity: string;
		isHandcashCreated: boolean;
		isVerified: boolean;
	};
	user: {
		alias: string;
		displayName: string;
		profilePictureUrl: string;
	};
	app: {
		id: string;
		name: string;
		iconUrl: string;
	};
	isHandcashCreated: boolean;
	isVerified: boolean;
	itemListing: {
		id: string;
		status: string;
		currencyCode: string;
		price: number;
		denominatedIn: string;
		paymentRequestUrl: string;
		paymentRequestId: string;
		fiatEquivalent: {
			currencyCode: string;
			amount: number;
		};
	};
};

export type DestinationsWithOrigins = {
	destination: string;
	origins: string;
};

export type SendItemParameters = {
	destinationsWithOrigins: DestinationsWithOrigins[];
};
