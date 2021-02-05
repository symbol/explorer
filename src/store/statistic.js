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
import { NetworkService, StatisticService, BlockService, NodeService } from '../infrastructure';
import { Order } from 'symbol-sdk';
import {
	DataSet,
	getStateFromManagers,
	getGettersFromManagers,
	getMutationsFromManagers,
	getActionsFromManagers
} from './manager';

const managers = [
	new DataSet(
		'nodeHeightStats',
		() => NodeService.getNodeHeightStats()
	)
];

const LOCK = Lock.create();

export default {
	namespaced: true,
	state: {
		// If the state has been initialized.
		...getStateFromManagers(managers),
		initialized: false,
		loading: true,
		loadingInfo: true,
		loadingBlockTimeDifference: true,
		loadingTransactionPerBlock: true,
		error: false,
		networkTransactionFees: [],
		networkRentalFees: [],
		blockTimeDifferenceData: [],
		transactionPerBlockData: []
	},
	getters: {
		...getGettersFromManagers(managers),
		getInitialized: state => state.initialized,
		getLoading: state => state.loading,
		getLoadingInfo: state => state.loadingInfo,
		getLoadingBlockTimeDifference: state => state.loadingBlockTimeDifference,
		getLoadingTransactionPerBlock: state => state.loadingTransactionPerBlock,
		getError: state => state.error,
		getNetworkTransactionFees: state => state.networkTransactionFees,
		getNetworkRentalFees: state => state.networkRentalFees,
		getBlockTimeDifferenceData: state => state.blockTimeDifferenceData,
		getTransactionPerBlockData: state => state.transactionPerBlockData
	},
	mutations: {
		...getMutationsFromManagers(managers),
		setInitialized: (state, initialized) => {
			state.initialized = initialized;
		},
		setLoading: (state, loading) => {
			state.loading = loading;
		},
		setLoadingInfo: (state, loadingInfo) => {
			state.loadingInfo = loadingInfo;
		},
		setLoadingBlockTimeDifference: (state, loadingBlockTimeDifference) => {
			state.loadingBlockTimeDifference = loadingBlockTimeDifference;
		},
		setLoadingTransactionPerBlock: (state, loadingTransactionPerBlock) => {
			state.loadingTransactionPerBlock = loadingTransactionPerBlock;
		},
		setError: (state, error) => {
			state.error = error;
		},
		setNetworkTransactionFees: (state, networkTransactionFees) => {
			state.networkTransactionFees = networkTransactionFees;
		},
		setNetworkRentalFees: (state, networkRentalFees) => {
			state.networkRentalFees = networkRentalFees;
		},
		setBlockTimeDifferenceData: (state, blockTimeDifferenceData) => {
			state.blockTimeDifferenceData = blockTimeDifferenceData;
		},
		setTransactionPerBlockData: (state, transactionPerBlockData) => {
			state.transactionPerBlockData = transactionPerBlockData;
		}
	},
	actions: {
		...getActionsFromManagers(managers),
		// Initialize the statistics model.
		async initialize({ commit, dispatch, getters }) {
			const callback = async () => {
				await dispatch('initializePage');
			};

			await LOCK.initialize(callback, commit, dispatch, getters);
		},

		// Uninitialize the statistics model.
		async uninitialize({ commit, dispatch, getters }) {
			const callback = async () => {};

			getters.nodeHeightStats?.uninitialize();
			await LOCK.uninitialize(callback, commit, dispatch, getters);
		},

		// Fetch data from the SDK / API and initialize the page.
		async initializePage(context) {
			context.commit('setLoading', true);
			context.commit('setLoadingInfo', true);
			context.commit('setLoadingBlockTimeDifference', true);
			context.commit('setLoadingTransactionPerBlock', true);
			context.getters.nodeHeightStats.setStore(context).initialFetch();

			context.commit('setError', false);
			try {
				let transactionFeesInfo = await NetworkService.getTransactionFeesInfo();

				let rentalFeesInfo = await NetworkService.getRentalFeesInfo();

				context.commit('setNetworkTransactionFees', transactionFeesInfo);
				context.commit('setNetworkRentalFees', rentalFeesInfo);
				context.commit('setLoadingInfo', false);

				const searchCriteria = {
					pageSize: 100,
					order: Order.Desc
				};

				const blocks = await BlockService.streamerBlocks(searchCriteria, 300);

				let blockTimeDifferenceDataset = StatisticService.getBlockTimeDifferenceData(blocks, 60);

				context.commit('setBlockTimeDifferenceData', blockTimeDifferenceDataset);
				context.commit('setLoadingBlockTimeDifference', false);

				let transactionPerBlockDataset = StatisticService.getTransactionPerBlockData(blocks, 60);

				context.commit('setTransactionPerBlockData', transactionPerBlockDataset);
				context.commit('setLoadingTransactionPerBlock', false);
			}
			catch (e) {
				console.error(e);
				context.commit('setError', true);
			}
			context.commit('setLoading', false);
		}
	}
};
