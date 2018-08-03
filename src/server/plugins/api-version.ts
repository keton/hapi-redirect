export default {
	plugin: require('hapi-api-version'),
	options: {
		basePath: '/api/',
		validVersions: [1],
		defaultVersion: 1,
		vendorName: 'hapi-redirect'
	}
};