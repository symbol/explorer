const { BlockHttp, ChainHttp, QueryParams } = require('nem2-sdk');
const utils = require('../utils');

const endpoint = utils.getNodeEndPoint();

const chainHttp = new ChainHttp(endpoint);
const blockHttp = new BlockHttp(endpoint);

async function getBlockHeight() {
	return (await chainHttp.getBlockchainHeight().toPromise()).compact();
}

async function getBlocksWithLimit(numberOfBlock, fromBlockHeight) {
	const currentBlockHeight = await getBlockHeight();

	let blockHeight = fromBlockHeight || currentBlockHeight;

	const blocks = await blockHttp
		.getBlocksByHeightWithLimit(blockHeight, numberOfBlock)
		.toPromise();

	return await utils.formatBlocks(blocks);
}

async function getBlockInfoByHeight(blockHeight) {
	const blockInfo = await blockHttp.getBlockByHeight(blockHeight).toPromise();

	return await utils.formatBlock(blockInfo);
}

async function getTransactionsByBlockHeight(blockHeight, id) {
	let txId = id || '';
	const pageSize = 100;

	let transactionlist = await blockHttp
		.getBlockTransactions(blockHeight, new QueryParams(pageSize, txId))
		.toPromise();

	if (transactionlist.length > 0) {
		return utils.formatTxs(transactionlist);
	}

	return transactionlist;
}

async function getBlockFullTransactionsList(blockHeight, id) {
	let txList = await getTransactionsByBlockHeight(blockHeight, id);
	if (txList.length > 0) {
		id = txList[txList.length - 1].transactionId;
		txList.concat(await getBlockFullTransactionsList(blockHeight, id));
	}
	return txList;
}

module.exports = {
	getBlockHeight,
	getBlocksWithLimit,
	getBlockInfoByHeight,
	getTransactionsByBlockHeight,
	getBlockFullTransactionsList,
};
