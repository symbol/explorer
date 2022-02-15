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

import Lock from './lock';
import helper from '../helper';
import { NodeService, ChainService, BlockService, FinalizationService } from '../infrastructure';
const LOCK = Lock.create();

export default {
	namespaced: true,
	state: {
		// If the state has been initialized.
		initialized: false,
		// The chain info.
		storageInfo: {
			// The total transactions.
			numTransactions: 0,
			// The total Accounts.
			numAccounts: 0
		},
		// The Market Data.
		marketData: {
			marketCap: 0,
			price: 0,
			historicalHourlyGraph: {}
		},
		chainInfo: {
			currentHeight: 0,
			finalizedBlockHeight: 0,
			epoch: 0,
			lastEpoch: {
				epoch: 0,
				age: ''
			}
		},
		nodeStats: {},
		loading: true
	},
	getters: {
		getInitialized: state => state.initialized,
		getLoading: state => state.loading,
		getStorageInfo: state => state.storageInfo,
		getMarketData: state => state.marketData,
		getChainInfo: state => state.chainInfo,
		getNodeStats: state => state.nodeStats
	},
	mutations: {
		setInitialized: (state, initialized) => {
			state.initialized = initialized;
		},
		setLoading: (state, v) => {
			state.loading = v;
		},
		setStorageInfo: (state, storageInfo) => {
			state.storageInfo.numTransactions = storageInfo.numTransactions;
			state.storageInfo.numAccounts = storageInfo.numAccounts;
		},
		setMarketData: (state, { marketData, graphData }) => {
			state.marketData.price = marketData.XEM.USD.PRICE;
			state.marketData.marketCap = marketData.XEM.USD.MKTCAP;
			state.marketData.historicalHourlyGraph = graphData;
		},
		setChainInfo: (state, { currentHeight, epoch, finalizedBlockHeight, lastEpoch }) => {
			state.chainInfo.currentHeight = currentHeight;
			state.chainInfo.epoch = epoch;
			state.chainInfo.finalizedBlockHeight = finalizedBlockHeight;
			state.chainInfo.lastEpoch = lastEpoch;
		},
		setNodeStats: (state, nodeStats) => {
			state.nodeStats = {
				...nodeStats,
				total: Array.from(Array(8).keys()).reduce((acc, val) => acc + (nodeStats[val] || 0))
			};
		}
	},
	actions: {
		// Initialize the chain model.
		async initialize ({ commit, dispatch, getters }) {
			const callback = async () => {
				await dispatch('initializePage');
			};

			await LOCK.initialize(callback, commit, dispatch, getters);
		},

		// Uninitialize the chain model.
		async uninitialize ({ commit, dispatch, getters }) {
			const callback = async () => {};

			await LOCK.uninitialize(callback, commit, dispatch, getters);
		},

		// Fetch data from the SDK / API and initialize the page.
		async initializePage ({ commit, dispatch }) {
			commit('setLoading', true);
			const [storageInfo, /* marketData, xemGraph, */ nodeStats] = await Promise.all([
				NodeService.getStorageInfo(),
				// DataService.getMarketPrice('XEM'),
				// DataService.getHistoricalHourlyGraph('XEM'),
				NodeService.getNodeStats().catch(() => {})
			]);

			commit('setLoading', false);

			commit('setStorageInfo', storageInfo);
			await dispatch('getChainInfo');

			// let graphData = [];

			// if (xemGraph) {
			// 	xemGraph.Data.map((item, index) => {
			// 		let graphDataItem = {};

			// 		graphDataItem.y = [];
			// 		graphDataItem.x = new Date(item['time'] * 1000);
			// 		graphDataItem.y[0] = item['open']; // parseFloat(item['open']).toFixed(4)
			// 		graphDataItem.y[1] = item['high']; // parseFloat(item['high']).toFixed(4)
			// 		graphDataItem.y[2] = item['low']; // parseFloat(item['low']).toFixed(4)
			// 		graphDataItem.y[3] = item['close']; // parseFloat(item['close']).toFixed(4)
			// 		graphData.push(graphDataItem);
			// 	});
			// }
			// commit('setMarketData', { marketData, graphData });

			if (nodeStats)
				commit('setNodeStats', nodeStats.nodeTypes);
		},

		async getChainInfo ({ commit }) {
			const [chainInfo] = await Promise.all([
				ChainService.getChainInfo()
			]);

			const lastEpoch = chainInfo.latestFinalizedBlock.finalizationEpoch - 1;

			const { height } = await FinalizationService.getFinalizationProofAtEpoch(lastEpoch);

			const { timestamp } = await BlockService.getBlockByHeight(height);

			commit('setChainInfo', {
				currentHeight: chainInfo.height,
				finalizedBlockHeight: chainInfo.latestFinalizedBlock.height,
				epoch: chainInfo.latestFinalizedBlock.finalizationEpoch,
				lastEpoch: {
					epoch: lastEpoch,
					age: helper.convertToUTCDate(timestamp)
				}
			});
		}
	}
};
