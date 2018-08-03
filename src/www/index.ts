import * as Glue from 'glue';

const manifest:Glue.Manifest={
	server: {
		host: "localhost",
		port: 8080,
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
