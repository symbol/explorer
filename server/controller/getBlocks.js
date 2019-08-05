var nem2Sdk = require('nem2-sdk');

var utils = require('../utils');

const BlockHttp = nem2Sdk.BlockHttp,
	ChainHttp = nem2Sdk.ChainHttp;

const endpoint = utils.getNodeEndPoint();

const chainHttp = new ChainHttp(endpoint);
const blockHttp = new BlockHttp(endpoint);

async function getBlockHeight() {
    return (await chainHttp
        .getBlockchainHeight()
        .toPromise()).compact();
}

async function getBlocksList(height) {
    return await blockHttp
    .getBlocksByHeightWithLimit(height, 25)
    .toPromise();
}

module.exports = {
	getBlockHeight,
	getBlocksList,
};