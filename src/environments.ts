const Environments = {
	prod: {
		apiEndpoint: 'https://cloud.handcash.io',
		clientUrl: 'https://app.handcash.io',
		trustholderEndpoint: 'https://trust.hastearcade.com',
	},
	qae: {
		apiEndpoint: 'https://qae.cloud.handcash.io',
		clientUrl: 'https://qa-market.handcash.io',
		trustholderEndpoint: 'https://trustholder-service.qae.cloud.handcash.io',
	},
	iae: {
		apiEndpoint: 'https://iae.cloud.handcash.io',
		clientUrl: 'https://iae-app.handcash.io',
		trustholderEndpoint: 'https://trustholder-service.iae.cloud.handcash.io',
	},
};

export default Environments;
