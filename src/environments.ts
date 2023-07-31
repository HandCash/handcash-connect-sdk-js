const Environments = {
	prod: {
		apiEndpoint: 'https://cloud.handcash.io',
		clientUrl: 'https://app.handcash.io',
		trustholderEndpoint: 'https://trust.hastearcade.com',
		cloudinary: {
			apiKey: '544588249773336',
			cloudName: 'hn8pdtayf',
			uploadPreset: 'ml_items',
		},
	},
	beta: {
		apiEndpoint: 'https://beta-cloud.handcash.io',
		clientUrl: 'https://beta-app.handcash.io',
		trustholderEndpoint: 'https://trust.dev.hastearcade.com',
		cloudinary: {
			apiKey: '882244126343337',
			cloudName: 'handcash-iae',
			uploadPreset: 'ml_items',
		},
	},
	iae: {
		apiEndpoint: 'https://iae.cloud.handcash.io',
		clientUrl: 'https://iae-app.handcash.io',
		trustholderEndpoint: 'http://trustholder-service-iae.us-east-1.elasticbeanstalk.com',
		cloudinary: {
			apiKey: '882244126343337',
			cloudName: 'handcash-iae',
			uploadPreset: 'ml_items',
		},
	},
};

export default Environments;
