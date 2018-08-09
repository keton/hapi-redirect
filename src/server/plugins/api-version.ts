import * as Hapi from 'hapi';
import { IConfig } from '$common/config';
import { Config } from 'convict';

/** hapi-api-version plugin options schema */
export interface IApiVersionOptions {
	validVersions: Array<number>,
	defaultVersion: number,
	vendorName: String,
	versionHeader?: String,
	passiveMode?: boolean,
	basePath?: String,
}

//default settings for swagger plugin
export const apiVersionDefaults: IApiVersionOptions = {
	basePath: '/api/',
	validVersions: [1,2],
	defaultVersion: 1,
	vendorName: 'hapi-redirect'
};

export const register = (server: Hapi.Server) => {
	return new Promise<void>(async (resolve,reject)=>{
		try {
			//get config object from server context
			let config:Config<IConfig>=await server.methods["getConfig"]();

			await server.register({
				plugin: require('hapi-api-version'),
				options: config.getProperties().pluginConfig.apiVersion //get plugin config from config store
			});
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

export const pkg = { 
	name: "api-version-with-options",
	version: "1.0.0" 
};
