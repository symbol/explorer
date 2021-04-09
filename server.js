const fs = require('fs');
const http = require('http');
const express = require('express');
const expressWs = require('express-ws');
const WebSocket = require('websocket').w3cwebsocket;
const Axios = require('axios')
const app = express();

const port = 3000;
const PORT = 4000;
const CONFIG_ROUTE = '/config';
const DEFAULT_CONFIG_PATH = '/src/config/default.json';
const STATIC_FOLDER = '/www';
const INDEX_HTML = '/index.html';

let CONFIG;


expressWs(app)
app.use(express.json());


const getFile = (url, errCallback, callback) => {
	fs.readFile(__dirname + STATIC_FOLDER + url, (err, data) => {
		if (err) {
			if(typeof errCallback === 'function')
				errCallback(err);
		}
		else
			if(typeof callback === 'function')
				callback(data);
	});
};

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
	app.get('/', (req, res, next) => {
		req.params[0] = INDEX_HTML;
		next();
	})

	app.get(CONFIG_ROUTE, (req, res) => {
		res.send(config)
	})
	
	app.ws('/connect/*/ws', (ws, req) => {
		const url = req.params[0].replace('http', 'ws') + '/ws';
		console.log('WS connected');

		let nodeListener = new WebSocket(url);
		nodeListener.onopen = () => {
			console.log('Listener connected to ' + url);
		};
		nodeListener.onmessage = (event) => {
			console.log('Listener message: ')
			ws.send(event.data);
		};
		nodeListener.onclose = (event) => {
			if (event.wasClean)
				console.log('Listener closed clean');
			else 
				console.log('Listener connection lost');	
			console.log('Listener closed. [' + event.code + ']: ' + event.reason);
			ws.close();
		};
		nodeListener.onerror = (error) => {
			console.log('Listener error: ' + error.message);
		};

		ws.on('error', err => console.log('WS error', err));
		ws.on('message', msg => {
			console.log('WS message: ', msg);
			nodeListener.send(msg);
		});
		ws.on('close', (e) => {
			console.log('WS closed', e);
			nodeListener.close();
			nodeListener = undefined;
		});
	});
	
	app.all('/connect/*', async (req, res, next) => {
		const url = req.params[0];
		let origin;
		try {
			origin = new URL(url).origin;
		}
		catch(e){}

		if (!config.peersApi.nodes.find(nodeUrl => nodeUrl === origin))
			return res.status(403).send(`"${origin}" is not in the peerApi node list`);
	
		try {
			// console.log(req.params);
			const options = {
				method: req.method.toLowerCase(),
				data: req.method === 'POST' && req.body,
				params: req.method === 'GET' && req.query,
				url: req.params[0]
			};
	
			// console.log('options', options) 
			const response = await Axios(options)
	
			// console.log(response.data)
			res.send(response.data)
		}
		catch(e) {
			res.status(e.response.statusCode ? e.response.statusCode : 500).send(e.response.message)
		}
	})

	app.all('/*', async (req, res, next) => {
		const url = '/' + req.params[0];
		if (url.length > 256)
			return res.status(400).send('Request too long');

		
		getFile(url,
			() => {
				getFile(INDEX_HTML,
					err => res.status(404).send(err),
					data => res.end(data)
				);
			},
			data => res.end(data)
		);
	})

	
	app.listen(PORT, () => {
		console.log('Server is running on port: ' + PORT)
	})
};

readConfig(startServer);
