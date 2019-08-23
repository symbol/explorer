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

var request = require('request');
var utils = require('../utils');

const coingeckoEndpoint = 'https://api.coingecko.com/api/v3/coins/nem';
const endpoint = utils.getNodeEndPoint();

function getMarketData() {
	return new Promise((resolve, reject) => {
		request(coingeckoEndpoint, (error, response, body) => {
			if (error) return reject(error);

			let info = JSON.parse(body);
			let marketData = info.market_data;

			let market_data = {
				currency: 'USD',
				price: marketData.current_price.usd,
				marketCap: marketData.market_cap.usd,
			};

			return resolve(market_data);
		});
	});
}

function getChainInfo() {
	return new Promise((resolve, reject) => {
		request(endpoint + '/diagnostic/storage', (error, response, body) => {
			if (error) return reject(error);

			let info = JSON.parse(body);
			let chain_info = {
				totalBlocks: info.numBlocks,
				totalTransactions: info.numTransactions,
				totalAccounts: info.numAccounts,
			};
			return resolve(chain_info);
		});
	});
}

module.exports = {
	getMarketData,
	getChainInfo,
};
