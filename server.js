const fs = require('fs');
const express = require('express');
const expressWs = require('express-ws');
const WebSocket = require('websocket').w3cwebsocket;
const Axios = require('axios')
const app = express();

const PORT = 4000;
const CONFIG_ROUTE = '/config';
const DEFAULT_CONFIG_PATH = '/src/config/default.json';
const STATIC_FOLDER = '/www';
const INDEX_HTML = '/index.html';

expressWs(app);
app.use(express.json());



// Set server routes

const setRootRoute = (server) => {
	server.get('/', (req, res, next) => {
		req.params[0] = INDEX_HTML;
		next();
	})
}

const setConfigRoute = (server, config) => {
	server.get(CONFIG_ROUTE, (req, res) => {
		res.send(config);
	})
}

const setNodeHttpRoutes = (server, nodeUrl) => {
	server.all(`/connect/${nodeUrl}/*`, async (req, res, next) => {
		const url = `${nodeUrl}/${req.params[0]}`;
		console.log(url)
		let origin;
		try {
			origin = new URL(req.originalUrl.replace('/connect/', '')).origin;
		}
		catch(e){}

		if (nodeUrl !== origin)
			return res.status(400).send(`Invalid URL "${origin}"`);

		try {
			const options = {
				method: req.method.toLowerCase(),
				data: req.method === 'POST' ? req.body : void 0,
				params: req.method === 'GET' ? req.query : void 0,
				url
			};

			const response = await Axios(options);
			res.send(response.data);
		}
		catch(e) {
			if (e.response)
				res.status(e.response.status ? e.response.status : 500).send(e.response.message);
			else
				res.status(500).send(e.message);
		}
	})
}

const setNodeWsRoutes = (server, nodeUrl) => {
	server.ws(`/connect/${nodeUrl}/ws`, (wsServer) => {
		const url = nodeUrl.replace('http', 'ws') + '/ws';
		console.log('WS connected');

		let nodeListener = new WebSocket(url);
		nodeListener.onopen = () => {
			console.log('Listener connected to ' + url);
		};
		nodeListener.onmessage = (event) => {
			console.log('Listener message: ')
			wsServer.send(event.data);
		};
		nodeListener.onclose = (event) => {
			if (event.wasClean)
				console.log('Listener closed clean');
			else 
				console.log('Listener connection lost');	
			console.log('Listener closed. [' + event.code + ']: ' + event.reason);
			wsServer.close();
		};
		nodeListener.onerror = (error) => {
			console.log('Listener error: ' + error.message);
		};

		wsServer.on('error', err => console.log('WS error', err));
		wsServer.on('message', msg => {
			console.log('WS message: ', msg);
			nodeListener.send(msg);
		});
		wsServer.on('close', (e) => {
			console.log('WS closed', e);
			nodeListener.close();
			nodeListener = undefined;
		});
	});
}

const setStaticHttpRoutes = (server) => {
	server.all('/*', async (req, res, next) => {
		const route = '/' + req.params[0];
		if (route.length > 256)
			return res.status(400).send('Request too long');

		
		readFileByRoute(route,
			data => res.end(data),
			() => {
				readFileByRoute(INDEX_HTML,
					data => res.end(data),
					err => res.status(404).send(err),
				);
			},
		);
	})
}



// Read static files

const readFileByRoute = (route, callback, errCallback) => {
	fs.readFile(__dirname + STATIC_FOLDER + route, (err, data) => {
		if (err) {
			if(typeof errCallback === 'function')
				errCallback(err);
		}
		else
			if(typeof callback === 'function')
				callback(data);
	});
};



// Get config from ENV and merge with default config json file

const readConfig = (callback) => {
	const ENV = process.env;

	fs.readFile(__dirname + DEFAULT_CONFIG_PATH, (err, data) => {
		if (err) throw Error('Failed to read default config. ' + err);
		else {
			const defaultConfig = JSON.parse(data);
			const parsedENV = {};
			Object.keys(ENV).forEach(key => {
				try {
					if (defaultConfig[key]) {
						parsedENV[key] = JSON.parse(ENV[key]);
					}
				}
				catch(e) {
					parsedENV[key] = ENV[key];
				}
			});
			const mergedConfig = {
				...defaultConfig,
				...parsedENV
			};

			callback(mergedConfig);
		}
	});
};





const startServer = config => {
	setRootRoute(app);
	setConfigRoute(app, config);
	config.peersApi.nodes.forEach(nodeUrl => { setNodeWsRoutes(app, nodeUrl); });
	config.peersApi.nodes.forEach(nodeUrl => { setNodeHttpRoutes(app, nodeUrl); });
	setStaticHttpRoutes(app);

	app.listen(PORT, () => {
		console.log('Server is running on port: ' + PORT)
	})
};

readConfig(startServer);
