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
