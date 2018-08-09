import * as Hapi from 'hapi';

/** hapi-api-version plugin options schema */
interface IApiVersionOptions {
	validVersions: Array<number>,
	defaultVersion: number,
	vendorName: String,
	versionHeader?: String,
	passiveMode?: boolean,
	basePath?: String,
}

//TODO: move configuration into common config store
const options: IApiVersionOptions = {
	basePath: '/api/',
	validVersions: [1],
	defaultVersion: 1,
	vendorName: 'hapi-redirect'
};

export const register = (server: Hapi.Server) => {
	return server.register({
		plugin: require('hapi-api-version'),
		options: options
	});
}

export const name = "api-version-with-options";
export const version = "1.0.0";
