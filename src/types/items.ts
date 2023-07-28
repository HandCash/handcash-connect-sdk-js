export type OrdinalItemAttribute = {
	name: string;
	value: string | number;
	displayType: 'string' | 'number';
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

export type AttributeFilter = {
	name: string;
	displayType: 'string' | 'number';
	operation: 'equal' | 'greater' | 'lower';
	value: string | number;
};

export type GetItemsFilter = {
	from: number;
	to: number;
	sort?: 'asc' | 'desc';
	order?: 'name';
	collectionId?: string;
	isVerified?: boolean;
	searchString?: string;
	attributes?: AttributeFilter[];
};

export type File = {
	url: string;
	contentType: string;
};

export type MediaDetails = {
	image: File;
	multimedia?: File;
};

export type ItemAttribute = {
	name: string;
	value: any;
	displayType: 'string' | 'number' | 'date' | 'boostPercentage' | 'boostNumber';
};

export type CreateItemsCollectionItem = {
	id?: string;
	name: string;
	description?: string;
	rarity?: string;
	user?: {
		alias: string;
		displayName: string;
		profilePictureUrl: string;
	};
	color?: string;
	attributes: ItemAttribute[];
	mediaDetails: MediaDetails;
	origin?: string;
};

export type CreateItemsOrder = {
	id: string;
	type: 'collectionItem' | 'collection';
	status: 'preparing' | 'pendingPayment' | 'pendingInscriptions' | 'completed';
	mintCostInUSD: number;
	collectionOrdinalId?: string;
	items: CreateItemsCollectionItem[];
	payment?: {
		paymentRequestId: string;
		paymentRequestUrl: string;
		transactionId: string;
		isConfirmed: boolean;
	};
	pendingInscriptions: number;
	error: string;
};

export type CreateItemsCollection = {
	name: string;
	description?: string;
	mediaDetails?: MediaDetails;
	totalQuantity: number;
};

export type NewCreateItemsOrder = {
	items: CreateItemsCollectionItem[] | CreateItemsCollection[];
	itemCreationOrderType: OrderType;
	referencedCollection?: string;
};

export type OrderType = 'collectionItem' | 'collection';

export type AddMintOrderItemsParams = {
	orderId: string;
	items: CreateItemsCollectionItem[] | CreateItemsCollection[];
	itemCreationOrderType: OrderType;
};
