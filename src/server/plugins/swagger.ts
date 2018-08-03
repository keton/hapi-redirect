const pkg = require('../../../package.json');

export default {
		plugin: require('hapi-swagger'),
		options: {
			info: {
				title: 'HapiJS URL shortener',
				description: ' \
					This is HapiJS URL shortener API demo \
				',
				version: pkg.version,
				contact: {
					name: 'Michal Lower',
					email: 'keton22@gmail.com'
				},
				license: {
					// Get the license from package.json
					name: pkg.license
				}
			},
			documentationPath: '/swagger',
			jsonEditor: true,
			tags: [
				{
					name: "public",
					description: "Publicly available API"
				},
				{
					name: "user",
					description: "User level authentication required"
				},
				{
					name: "admin",
					description: "Admin level authentication required"
				}
			],
			// This is for use of grouping together paths.  Since each of our paths begin with `/api/v{1,2}`, we want to ignore those first to arguments in the path, since they won't help us group together resources
			pathPrefixSize: 2,
			// This is also used for grouping, though because of the line above, I don't believe that this line may be needed.  Seems to work with/without it.
			//basePath: '/api/',
			// Also used for grouping paths together
			pathReplacements: [{
				// Replace the version in all paths
				replaceIn: 'groups',
				pattern: /v([0-9]+)\//,
				replacement: ''
			},
			{
				// This allows grouping to include plural forms of the noun to be grouped with their singular counter-part (ie `characters` in the group `character`)
				replaceIn: 'groups',
				pattern: /s$/,
				replacement: ''
			}]
		}
};
