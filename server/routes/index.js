var express = require('express');
var router = express.Router();
var { getHomeInfo, getBlocks } = require('../controller/index');

router.get('/homeInfo', async function(req, res, next) {
	// Todo: Average block time
	let marketData = await getHomeInfo.getMarketData();
	let chainInfo = await getHomeInfo.getChainInfo();

	res.json({
		data: {
			marketData,
			chainInfo,
		},
	});
});

router.get('/accounts', async function(req, res, next) {
	// Todo: get AccountsList
	res.json({
		status: 1,
		data: `accoutList`,
	});
});

router.get('/accounts/:address', async function(req, res, next) {
	// Todo:  get Account by Address
	res.json({
		status: 1,
		data: req.params.address,
	});
});

router.get('/blocks', async function(req, res, next) {
	const blockHeight = await getBlocks.getBlockHeight();
	const blockList = await getBlocks.getBlocksList(blockHeight);

	res.json({
		data: {
			blockHeight,
			blockList,
		},
	});
});

router.get('/blocks/:height', function(req, res, next) {
	res.json({
		blockInfo: {
			height: req.params.height,
		},
		status: 1,
		data: 'Home',
		message: 'Home API',
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
