import { TransactionParticipant } from './payments';

export type Many<E> = {
	items: E[];
};

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
	externalId?: string;
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

export const sortableFields = {
	name: 'name',
};

export type GetItemsFilter = {
	from?: number;
	to?: number;
	collectionId?: string;
	searchString?: string;
	groupingValue?: string;
	fetchAttributes?: boolean;
	sort?: keyof typeof sortableFields;
	order?: 'asc' | 'desc';
	attributes?: AttributeFilter[];
	isHandcashCreated?: boolean;
	isVerified?: boolean;
	appId?: string;
	group?: boolean;
	externalId?: string;
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

export type Action = {
	name: string;
	description: string;
	url: string;
	enabled?: boolean;
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
	actions: Action[];
	groupingValue?: string;
	externalId?: string;
};

export type CreateItemsOrderParams = {
	collectionId: string;
	items: CreateItemMetadata[];
	uid?: string;
};

export type BurnAndCreateItemsOrderParams = {
	issue?: CreateItemsOrderParams;
	burn: {
		origins: string[];
	};
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
	uid?: string;
};

export type ItemTransferAndCreateItemsOrder = {
	itemTransfer: ItemTransfer;
	itemCreationOrder: CreateItemsOrder;
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
	uid?: string;
};

export type NewBurnAndCreateItemsOrder = {
	issue?: NewCreateItemsOrder;
	burn: {
		origins: string[];
	};
};

export type OrderType = 'collectionItem' | 'collection';

export type AddMintOrderItemsParams = {
	orderId: string;
	items: CreateItemMetadata[];
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
			id: string;
			name: string;
			type: string;
			profilePictureUrl: string;
		};
	}[];
};

export type ItemTransfer = {
	id: string;
	label: 'send' | 'receive' | 'marketBuy' | 'marketSell' | 'marketCancel';
	payment?: ItemPayment;
	items: SingleItemTransfer[];
	createdAt: string;
};

export type SingleItemTransfer = {
	to: TransactionParticipant;
	from: TransactionParticipant;
	origin: string;
	name: string;
	imageUrl: string;
};

export type ItemPayment = {
	transactionId: string;
	currencyCode: string;
	amount: number;
	fiatEquivalent: {
		currencyCode: string;
		amount: number;
	};
};
