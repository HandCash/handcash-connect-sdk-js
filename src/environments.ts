const Environments = {
	prod: {
		apiEndpoint: 'https://cloud.handcash.io',
		clientUrl: 'https://app.handcash.io',
		trustholderEndpoint: 'https://trust.hastearcade.com',
	},
	beta: {
		apiEndpoint: 'https://beta-cloud.handcash.io',
		clientUrl: 'https://beta-app.handcash.io',
		trustholderEndpoint: 'https://trust.dev.hastearcade.com',
	},
	iae: {
		apiEndpoint: 'https://iae.cloud.handcash.io',
		clientUrl: 'https://iae-app.handcash.io',
		trustholderEndpoint: 'http://trustholder-service-iae.us-east-1.elasticbeanstalk.com',
	},
} as const;

export default Environments;
