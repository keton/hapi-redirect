import * as Hapi from 'hapi';
import { IConfig } from '$common/config';
import { Config } from 'convict';

const pkgInfo = require('../../../package.json');

interface ISwaggerOptionsPathRepacement {
	replaceIn?: 'groups' | 'endpoints' | 'all',
	pattern?: RegExp
	replacement?: string
}

interface ISwaggerOptionsTag {
	name: string,
	description?: string,
	externalDocs?: {
		description?: string,
		url?: string
	}
}

/** hapi-swagger plugin options schema */
export interface ISwaggerOptions {
	info: {
		title: string,
		description?: string,
		termsOfService?: string,
		contact?: {
			name?: string,
			url?: string,
			email?: string
		},
		license?: {
			name?: string,
			url?: string,
		},
		version: string
	},
	debug?: boolean,
	jsonPath?: string,
	documentationPath?: string,
	documentationRouteTags?: string | Array<string>,
	swaggerUIPath?: string,
	auth?: boolean | string | object,
	pathPrefixSize?: number,
	payloadType?: 'form' | 'json',
	documentationPage?: boolean,
	swaggerUI?: boolean,
	jsonEditor?: boolean
	expanded?: 'none' | 'list' | 'full',
	lang?: 'en' | 'es' | 'fr' | 'it' | 'ja' | 'pl' | 'pt' | 'ru' | 'tr' | 'zh-cn',
	sortTags?: 'default' | 'name'
	sortEndpoints?: 'path' | 'method' | 'ordered'
	sortPaths?: 'unsorted' | 'path-method',
	uiCompleteScript?: string
	xProperties?: boolean,
	reuseDefinitions?: boolean,
	definitionPrefix?: string,
	deReference?: boolean,
	validatorUrl?: string,
	acceptToProduce?: string,
	cors?: boolean,
	pathReplacements?: Array<ISwaggerOptionsPathRepacement>,
	tags?: Array<ISwaggerOptionsTag>
}

//default settings for swagger plugin
export const swaggerDefaults: ISwaggerOptions = {
	info: {
		title: 'HapiJS URL shortener',
		description: ' \
				This is HapiJS URL shortener API demo \
			',
		version: pkgInfo.version,
		contact: {
			name: 'Michal Lower',
			email: 'keton22@gmail.com'
		},
		license: {
			// Get the license from package.json
			name: pkgInfo.license
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
};

export const register = (server: Hapi.Server) => {
	return new Promise<void>(async (resolve,reject)=>{
		try {
			let config:Config<IConfig>=await server.methods["getConfig"]();
			await server.register({
				plugin: require('hapi-swagger'),
				options: config.getProperties().pluginConfig.swagger
			});
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

export const pkg = { 
	name: "swagger-with-options",
	version: "1.0.0" 
};
