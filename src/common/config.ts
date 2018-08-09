import Glue from 'glue';
import Convict from 'convict';
import { Schema } from 'convict';
import { IApiVersionOptions, apiVersionDefaults } from '$plugins/api-version';
import { ISwaggerOptions, swaggerDefaults } from '$plugins/swagger';
import * as Hapi from 'hapi';

export interface IConfig {
	manifest: Glue.Manifest,
	pluginConfig: {
		apiVersion: IApiVersionOptions,
		swagger: ISwaggerOptions
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
	}
};

let config: Convict.Config<IConfig>;
let configInitialized = false;

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

export const initConfig=(configFile?:string)=>{
	try {
		if (!configInitialized) {
			config = Convict<IConfig>(ConfigSchema);
			config.validate();
			if(configFile) {
				config.loadFile(configFile);
			}
			configInitialized=true;
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