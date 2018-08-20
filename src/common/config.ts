import Convict from 'convict';
import { Schema } from 'convict';
import * as Hapi from 'hapi';
import Glue from 'glue';
import { IApiVersionOptions, apiVersionDefaults } from '$plugins/api-version';
import { ISwaggerOptions, swaggerDefaults } from '$plugins/swagger';
import { ConfigVariables } from '$common/configVariables';
import deepmerge from 'deepmerge';

export interface IConfig {

	/** Glue server manifest */
	manifest: Glue.Manifest,

	/** Hapi plugin configuration */
	pluginConfig: {
		apiVersion: IApiVersionOptions,
		swagger: ISwaggerOptions
	},
	dbConfig: {
		/** database host */
		host: string,

		/** database port */
		port: number,

		/** database user name */
		user: string,

		/** database password */
		password: string,

		/** database name */
		name: string,

		/** users collection name */
		usersCollection: string,

		/** redirects collection name */
		redirectsCollection: string
	}
}

const ConfigSchema: Schema<IConfig> = {
	manifest: {
		server: {
			host: {
				doc: "Hostname or ip address to bind to",
				default: "localhost",
				format: "String"
			},
			port: {
				default: 8080,
				doc: "Port to listen on",
				format: "port"
			}
		},
		register: {
			plugins: {
				doc: "Array of plugins to register within the server",
				default: [
					"$common/config",
					"vision",
					"inert",
					"$plugins/swagger",
					"$plugins/api-version",
				],
				format: "Array"
			}
		}
	},
	pluginConfig: {
		apiVersion: {
			doc: "hapi-api-version plugin configuration",
			default: apiVersionDefaults,
			format: "Object"
		},
		swagger: {
			doc: "hapi-swagger plugin configuration",
			default: swaggerDefaults,
			format: "Object"
		}
	},
	dbConfig: {
		host: {
			doc: "database host",
			env: ConfigVariables.dbHost,
			default: "localhost",
			format: "String"
		},
		port: {
			doc: "database port",
			env: ConfigVariables.dbPort,
			default: 27017,
			format: "port"
		},
		user: {
			doc: "database user name",
			env: ConfigVariables.dbUser,
			format: "String",
			sensitive: true,
			default: ""
		},
		password: {
			doc: "database password",
			env: ConfigVariables.dbPass,
			format: "String",
			sensitive: true,
			default: ""
		},
		name: {
			doc: "database name",
			env: ConfigVariables.dbName,
			format: "String",
			default: "production"
		},
		usersCollection: {
			doc: "users collection name",
			format: "String",
			default: "users"
		},
		redirectsCollection: {
			doc: "redirects collection name",
			format: "String",
			default: "redirects"
		}
	}
};

let config: Convict.Config<IConfig>;
let configInitialized = false;

//register getConfig handler in hapi server object
export const register = (server: Hapi.Server) => {
	return new Promise<void>((resolve, reject) => {
		try {
			if (!configInitialized) initConfig();

			server.method("getConfig", () => {
				return new Promise<Convict.Config<IConfig>>((resolve, reject) => {
					resolve(config);
				});
			});
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

export const initConfig = (configFile?: string) => {
	try {
		if (!configInitialized) {
			config = Convict<IConfig>(ConfigSchema);
			if (configFile) {
				/**
				 * Convict doesn't deep merge loaded config file with defaults.
				 * 
				 * If there's object within an object it'll be overwritten
				 * 
				 * So we perform deep merge of default config and partial defined in config file 
				 */
				//default configuration as per schema
				let defConfig=config.getProperties();

				//configuration applied in config file
				let newConfig=Convict<IConfig>(ConfigSchema).loadFile(configFile).validate().getProperties();

				//change deepmerge behaviour to overwrite old array with new one instead of merging, this is required for Hapi plugin list
				const overwriteMerge = (destinationArray:any, sourceArray:any, options:any) => sourceArray;

				//perform deep merge of configs
				let mergedConfig=deepmerge<IConfig>(defConfig, newConfig, {arrayMerge: overwriteMerge});

				//apply new settings to the config store
				config.load(mergedConfig);

			}

			config.validate({
				allowed: "strict"
			});
			configInitialized = true;
		}
	} catch (error) {
		console.error(error);
		process.exit(-1);
	} finally {
		return config;
	}
}

export const pkg = {
	once: true,
	name: "Config",
	version: "1.0.0"
}