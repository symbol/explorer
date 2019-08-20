var express = require('express');
var router = express.Router();
const {
	homeInfo,
	blocks,
	accounts,
	transactions,
  namespaces,
  mosaics
} = require('../controller/index');

router.get('/homeInfo', async function(req, res, next) {
	// Todo: Average block time
	let marketData = await homeInfo.getMarketData();
	let chainInfo = await homeInfo.getChainInfo();
	let recentBlocks = await blocks.getBlocksWithLimit(5);

	res.json({
		data: {
			marketData,
			chainInfo,
			recentBlocks,
		},
	});
});

router.get('/accounts', async function(req, res, next) {
	// Todo: get AccountsList
});

router.get('/account/:address', async function(req, res, next) {
	const address = req.params.address;
	const accountInfo = await accounts.getAccountInfoByAddress(address);
	const accountTransaction = await accounts.getAccountTransactionsByAddress(
		address
	);

	const ownedNamespaceList = await namespaces.getNamespacesFromAccountByAddress(
		address
	);

	res.json({
		data: {
			accountInfo,
			accountTransaction,
			ownedNamespaceList,
		},
	});
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
	const blockList = await blocks.getBlocksWithLimit(25, height);
	res.json({
		data: {
			blockList,
		},
	});
});

router.get('/block/:height', async function(req, res, next) {
	const height = req.params.height;
	const blockInfo = await blocks.getBlockInfoByHeight(height);
	const blockTransactionList = await blocks.getBlockFullTransactionsList(
		height
	);

	res.json({
		data: {
			blockInfo,
			blockTransactionList,
		},
	});
});

router.get('/transactions', (req, res, next) => {
	// Todo: get transactions list
});

router.get('/transaction/:txHash', async (req, res, next) => {
	const txHash = req.params.txHash;
	const transactionInfo = await transactions.getTransactionInfoByHash(txHash);
	res.json({
		data: {
			transactionInfo,
		},
	});
});

router.get('/namespaces', (req, res, next) => {
	// Todo: get namespaces list
});

router.get('/namespace/:namespaceName', async (req, res, next) => {
	const namespaceName = req.params.namespaceName;

	const namespaceInfo = await namespaces.getNamespaceInfoByName(namespaceName);

	res.json({
		data: {
			namespaceInfo,
		},
	});
});

router.get('/mosaics', (req, res, next) => {
	// Todo: get namespaces list
});

router.get('/mosaic/:mosaicHex', async (req, res, next) => {
  const mosaicHex = req.params.mosaicHex;
  const mosaicInfo = await mosaics.getMosaicInfoByHex(mosaicHex);

  res.json({
		data: {
			mosaicInfo,
		},
	});
});

router.get('/node', (req, res, next) => {
	// Todo: get node list
});

router.get('/statitics', (req, res, next) => {
	// Todo: get statitics info
});

module.exports = router;
