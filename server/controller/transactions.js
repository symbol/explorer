/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const { TransactionHttp } = require('nem2-sdk');
const utils = require('../utils');
const request = require('request');
const {
	getBlockHeight,
	getBlockInfoByHeight,
	getBlockFullTransactionsList,
} = require('./blocks');

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

async function getTransactionList(blockHeight, txId) {
	let currentHeight = await getBlockHeight();
	let transactionId = txId || '';
	let chainHeight = blockHeight || currentHeight;
	const totalOfTransactionRequest = 5;

	let transactionList = [];

	while (
		transactionList.length < totalOfTransactionRequest &&
		chainHeight != 0
	) {
		let info = await getBlockInfoByHeight(chainHeight);

		if (info.numTransactions != 0) {
			let txs = await getBlockFullTransactionsList(info.height, transactionId);
			txs.map(tx => {
				transactionList.push(tx);
			});
		}
		chainHeight--;
		transactionId = '';
	}

	return transactionList;
}

module.exports = {
	getTransactionInfoByHash,
	getTransactionList,
};
