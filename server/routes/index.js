var express = require('express');
var router = express.Router();
const { homeInfo, blocks } = require('../controller/index');

router.get('/homeInfo', async function(req, res, next) {
	// Todo: Average block time
	let marketData = await homeInfo.getMarketData();
	let chainInfo = await homeInfo.getChainInfo();
	let recentBlocks = await blocks.getBlocksWithLimit(5);

	res.json({
		data: {
			marketData,
			chainInfo,
			recentBlocks
		},
	});
});

router.get('/accounts', async function(req, res, next) {
	// Todo: get AccountsList
});

router.get('/accounts/:address', async function(req, res, next) {
	// Todo:  get Account by Address
});

router.get('/blocks', async function(req, res, next) {
	const blockList = await blocks.getBlocksWithLimit(25);

	res.json({
		data: {
			blockList,
		},
	});
});

router.get('/blocks/:fromBlockHeight', async function(req, res, next) {
	const height = req.params.fromBlockHeight;
	const blockList = await blocks.getBlocksWithLimit(25,height);

	res.json({
		data: {
			blockList,
		},
	});
});

router.get('/block/:height', async function(req, res, next) {
	const height = req.params.height;
	const blockInfo = await blocks.getBlockInfoByHeight(height);
	const blockTransactionList = await blocks.getBlockFullTransactionsList(height);

	res.json({
		blockInfo,
		blockTransactionList
	});
});

router.get('/transactions', (req, res, next) => {
	// Todo: get transactions list
});

router.get('/transactions/:txHash', (req, res, next) => {
	// Todo: get transactions by hash
});

router.get('/namespaces', (req, res, next) => {
	// Todo: get namespaces list
});

router.get('/namespaces/:namespace', (req, res, next) => {
	// Todo: get namespaces by id or name
});

router.get('/mosaics', (req, res, next) => {
	// Todo: get namespaces list
});

router.get('/mosaics/:mosaic', (req, res, next) => {
	// Todo: get mosaics by mosaicsID or name
});

router.get('/node', (req, res, next) => {
	// Todo: get node list
});

router.get('/statitics', (req, res, next) => {
	// Todo: get statitics info
});

router.get('/chainInfo', (req, res, next) => {
	// Todo: get statitics info
});

module.exports = router;
