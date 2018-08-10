import * as Glue from 'glue';
import { initConfig } from '$common/config';
import { ConfigVariables } from '$common/configVariables';

const runServer = async (): Promise<void> => {

	try {
		//initialize config store
		let config = initConfig(process.env[ConfigVariables.configFile]);

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
