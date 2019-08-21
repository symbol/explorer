const { TransactionHttp } = require('nem2-sdk');
const utils = require('../utils');
const request = require('request');

const endpoint = utils.getNodeEndPoint();

const transactionHttp = new TransactionHttp(endpoint);

async function getTransactionInfoByHash(hash) {
	// Todo getTransaction
	// const transaction = await transactionHttp.getTransaction(hash).toPromise(); // waiting SDK fix duel rest change
	const transaction = await getTransaction(hash);

	const transactionStatus = await transactionHttp
		.getTransactionStatus(hash)
		.toPromise();

	const transactionInfo = {
		// transaction: utils.formatTransaction(transaction),
		transaction: utils.formatTransactionFromApi(transaction),
		status: transactionStatus.status,
		confirm: transactionStatus.group,
	};

	return transactionInfo;
}

function getTransaction(hash) {
	return new Promise((resolve, reject) => {
		request(endpoint + '/transaction/' + hash, (error, response, body) => {
			if (error) return reject(error);
			let info = JSON.parse(body);
			return resolve(info);
		});
	});
}

module.exports = {
	getTransactionInfoByHash,
};
