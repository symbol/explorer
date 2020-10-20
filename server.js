const fs = require('fs');
const http = require('http');

const PORT = 4000;
const CONFIG_ROUTE = '/config';
const STATIC_FOLDER = '/www';
const INDEX_HTML = '/index.html';
const ENV = JSON.stringify(process.env);



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
