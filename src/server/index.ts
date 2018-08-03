import * as Glue from 'glue';
import Swagger from "$plugins/swagger";
import ApiVersion from "$plugins/api-version";

const manifest:Glue.Manifest={
	server: {
		host: "localhost",
		port: 8080,
	},
	register: {
		plugins: [
			"vision",
			"inert",
			Swagger,
			ApiVersion
		]
	}
}

const runServer = async (): Promise<void> => {
	
	try {
		//create HapiJS server from manifest
		let server=await Glue.compose(manifest);	
		
		//display message on boot
		server.events.once("start", () => {
			console.log('Server running at:', server.info.uri);
		});

		//launch server
		await server.start();

	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}


runServer();
