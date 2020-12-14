/**
 * @typedef {Object} Environment
 * @property {string} apiEndpoint
 * @property {string} clientUrl
 */
const Environments = {
   prod: {
      apiEndpoint: 'https://cloud.handcash.io',
      clientUrl: 'https://app.handcash.io',
   },
   beta: {
      apiEndpoint: 'https://beta-cloud.handcash.io',
      clientUrl: 'https://beta-app.handcash.io',
   },
   iae: {
      apiEndpoint: 'https://iae.cloud.handcash.io',
      clientUrl: 'https://iae-app.handcash.io',
   },
};

module.exports = Environments;
