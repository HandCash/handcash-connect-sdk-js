export type ItemAttribute = {
	name: string;
	value: string | number;
	displayType: 'string' | 'number';
};

export type Item = {
	id: string;
	origin: string;
	name: string;
	description: string;
	imageUrl: string;
	multimediaUrl: string;
	multimediaType: string;
	rarity: string;
	color: string;
	attributes: ItemAttribute[];
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
	fetchAttributes?: boolean;
};

export type File = {
	url: string;
	contentType: string;
	imageHighResUrl?: string;
};

export type MediaDetails = {
	image: File;
	multimedia?: File;
};

export type ItemAttributeMetadata = {
	name: string;
	value: any;
	displayType: 'string' | 'number' | 'date' | 'boostPercentage' | 'boostNumber';
};

export type Royalty = {
	type: 'paymail' | 'address' | 'script';
	percentage: number;
	destination: string;
};

export type CreateItemMetadata = {
	name: string;
	user?: string;
	description?: string;
	rarity?: string;
	quantity: number;
	color?: string;
	attributes: ItemAttributeMetadata[];
	mediaDetails: MediaDetails;
	origin?: string;
	royalties?: Royalty[];
};

export type CreateItemsOrderParams = {
	collectionId: string;
	items: CreateItemMetadata[];
};

export type CreateItemsOrder = {
	id: string;
	type: 'collectionItem' | 'collection';
	status: 'preparing' | 'pendingPayment' | 'pendingInscriptions' | 'completed';
	collectionOrdinalId?: string;
	items: CreateItemMetadata[];
	payment?: {
		paymentRequestId: string;
		paymentRequestUrl: string;
		amountInUSD: number;
		transactionId: string;
		isConfirmed: boolean;
	};
	pendingInscriptions?: number;
	error?: string;
};

export type CreateCollectionMetadata = {
	name: string;
	description?: string;
	mediaDetails: MediaDetails;
	totalQuantity?: number;
};

export type NewCreateItemsOrder = {
	items: CreateItemMetadata[] | CreateCollectionMetadata[];
	itemCreationOrderType: OrderType;
	referencedCollection?: string;
};

export type OrderType = 'collectionItem' | 'collection';

export type AddMintOrderItemsParams = {
	orderId: string;
	items: CreateItemMetadata[] | CreateItemMetadata[];
	itemCreationOrderType: OrderType;
};

export type TransferItemParameters = {
	destinationsWithOrigins: {
		destination: string;
		origins: string[];
	}[];
};

export type ItemTransferResult = {
	transactionId: string;
	transferItems: {
		origin: string;
		direction: 'send' | 'receive' | 'marketBuy' | 'marketSell' | 'marketCancel' | 'packBuy' | 'packSell';
		participant: {
			name: string;
			type: string;
		};
	}[];
};
