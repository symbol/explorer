var nem2Sdk = require('nem2-sdk');
const NodeHttp = nem2Sdk.NodeHttp;

const Nodes = [
	{ protocol: 'http', domain: '52.194.207.217', port: 3000 },
	{ protocol: 'http', domain: '3.1.202.148', port: 3000 },
	{ protocol: 'http', domain: '13.114.200.132', port: 3000 },
	{ protocol: 'http', domain: '47.107.245.217', port: 3000 },
	{ protocol: 'https', domain: 'jp5.nemesis.land', port: 3001 },
	{ protocol: 'http', domain: '13.114.200.132', port: 3001 },
];

function getNodeEndPoint() {
	// Todo: Check on node status before return
	let endPoint =
		Nodes[1].protocol + '://' + Nodes[1].domain + ':' + Nodes[1].port;
	return endPoint;
}

module.exports = {
	getNodeEndPoint,
};
