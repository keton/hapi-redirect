/** 
 * MongoDB connection URI schema 
 * as described in https://docs.mongodb.com/manual/reference/connection-string/ 
 * */
interface IMongoUri {
	user?: string,
	password?: string,
	hosts: Array<{
		host: string,
		port?: number,
	}>,
	database?: string

	//TODO: add options support
}

/** Builds connection URI string based on parameters */
export default (mongoUri: IMongoUri): string => {
	let ret = "mongodb://";

	if (mongoUri.user && mongoUri.password) {
		if (mongoUri.user.length > 0 && mongoUri.password.length > 0) {
			ret += mongoUri.user + ":" + mongoUri.password + "@";
		}
	}

	mongoUri.hosts.forEach((host,index,array) => {
		ret += host.host;
		if (host.port) {
			ret += ":" + host.port;
		}

		if(index<array.length-1) {
			ret+=",";
		}
	});

	if(mongoUri.database && mongoUri.database.length > 0) {
		ret+="/"+mongoUri.database;
	}

	return ret;
}