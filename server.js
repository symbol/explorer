const fs = require('fs');
const http = require('http');

const PORT = 4000;
const CONFIG_ROUTE = '/config';
const DEFAULT_CONFIG_PATH = '/src/config/default.json';
const STATIC_FOLDER = '/www';
const INDEX_HTML = '/index.html';

let ENV;


const readConfig = (callback) => {
	const ENV = process.env;
	const isENVObjectNotEmpty = Object.keys(process.env).length > 0;
	
	if(isENVObjectNotEmpty) {
		callback(JSON.stringify(ENV));
	}
	else {
		fs.readFile(__dirname + DEFAULT_CONFIG_PATH, (err, data) => {
			if (err) throw Error('Failed to read default config. ' + err);
			else callback(data);
		});
	}
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
	send(res, data);
}

const sendError = (res, err, code) => {
	res.writeHead(code);
	res.end(JSON.stringify(err));
	return;
};

readConfig(res => ENV = res);

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
}).listen(PORT);

console.log('Server is running on port: ' + PORT);
