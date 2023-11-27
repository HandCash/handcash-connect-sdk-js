import Joi from 'joi';
import { CollectionDefinition, ItemMetadata } from '../types/items';

const mediaSchema = Joi.object({
	image: Joi.object({
		url: Joi.string().required(),
		contentType: Joi.string()
			.allow(
				'image/png',
				'image/jpg',
				'image/gif',
				'text/html',
				'audio/mpeg',
				'application/fbx',
				'application/glb'
			)
			.required(),
		imageHighResUrl: Joi.string().uri().optional(),
	}),
});

const configSchema = Joi.object({
	collection: Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		mediaDetails: mediaSchema,
	}),

	items: Joi.array().items(
		Joi.object({
			name: Joi.string().required(),
			rarity: Joi.string(),
			color: Joi.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
			quantity: Joi.number().min(1).required(),
			mediaDetails: mediaSchema.required(),
			attributes: Joi.array().items(
				Joi.object({
					name: Joi.string().required(),
					value: Joi.required(),
					displayType: Joi.string().allow('string', 'number', 'date', 'boostPercentage', 'boostNumber'),
				})
			),
		})
	),
});

export default class JsonCollectionMetadataLoader {
	// eslint-disable-next-line class-methods-use-this
	async loadFromData(rawData: string): Promise<CollectionDefinition> {
		const jsonData = JSON.parse(rawData);
		const data = await configSchema.validateAsync(jsonData);
		const items: ItemMetadata[] = data.items.map((item: any) =>
			JsonCollectionMetadataLoader.loadItemFromRawItemData(item)
		);
		return {
			collection: {
				...data.collection,
				totalQuantity: items.map((item) => item.quantity).reduce((a, b) => a + b, 0),
			},
			items,
		};
	}

	private static loadItemFromRawItemData(itemData: any): ItemMetadata {
		return {
			name: itemData.name,
			rarity: itemData.rarity,
			quantity: itemData.quantity,
			attributes: itemData.attributes,
			mediaDetails: itemData.mediaDetails,
			color: itemData.color,
		};
	}
}
