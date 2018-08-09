import * as Glue from 'glue';
import { initConfig } from '$common/config';

const runServer = async (): Promise<void> => {

	try {
		//initialize config store
		//TODO: handle loading config files
		let config = initConfig();

		//create HapiJS server from manifest
		let server = await Glue.compose(config.getProperties().manifest);

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
