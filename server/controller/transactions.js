const { TransactionHttp } = require('nem2-sdk');
const utils = require('../utils');

const endpoint = utils.getNodeEndPoint();

const transactionHttp = new TransactionHttp(endpoint);

async function getTransactionInfoByHash(hash) {
	// Todo getTransaction
	// const transaction = await transactionHttp.getTransaction(hash).toPromise();
	const transactionStatus = await transactionHttp
		.getTransactionStatus(hash)
		.toPromise();

	const transactionInfo = {
		// transaction: utils.formatTransaction(transaction),
		status: transactionStatus.status,
		confirm: transactionStatus.group,
	};

	return transactionInfo;
}

module.exports = {
	getTransactionInfoByHash,
};
