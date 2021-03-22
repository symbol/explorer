const fs = require('fs');
const http = require('http');
const express = require('express');
const expressWs = require('express-ws')
const Axios = require('axios')
const app = express()
const port = 3000

expressWs(app)

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.all('/connect/*', async (req, res, next) => {
	if (req.method === 'WS')
		next();

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

app.ws('/connect/*', (ws, req) => {
	console.log('WS connected', req.params)
	ws.send(req.params)
    ws.on('message', msg => {
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const PORT = 4000;
const CONFIG_ROUTE = '/config';
const DEFAULT_CONFIG_PATH = '/src/config/default.json';
const STATIC_FOLDER = '/www';
const INDEX_HTML = '/index.html';

let ENV;


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

const send = (res, data) => {
	res.writeHead(200);
	res.end(data);
};

const sendJSON = (res, data) => {
	res.setHeader('Content-Type', 'application/json');
	send(res, JSON.stringify(data));
}

const sendError = (res, err, code) => {
	res.writeHead(code);
	res.end(JSON.stringify(err));
	return;
};

readConfig(res => {
	ENV = res;

	http.createServer((req, res) => {
		if(req.url === '/')
			req.url = INDEX_HTML;
			

		if(req.url === CONFIG_ROUTE) {
			sendJSON(res, ENV);
		}
		else {
			getFile(req.url,
				() => {
					getFile(INDEX_HTML,
						err => sendError(res, err, 404),
						data => send(res, data)
					);
				},
				data => send(res, data)
			);
		}
	}).listen(ENV.PORT || PORT);

	console.log('Server is running on port: ' + PORT);
});
