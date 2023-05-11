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
import {
	DataSet,
	Pagination,
	getActionsFromManagers,
	getGettersFromManagers,
	getMutationsFromManagers,
	getStateFromManagers
} from './manager';
import { Constants, filters } from '../config';
import { TransactionService } from '../infrastructure';
import { TransactionType } from 'symbol-sdk';

const managers = [
	new Pagination({
		name: 'timeline',
		fetchFunction: (pageInfo, filterValue) => TransactionService.getTransactionList(pageInfo, filterValue),
		pageInfo: {
			pageSize: Constants.PageSize
		},
		filter: filters.transaction
	}),
	new DataSet(
		'info',
		hash => TransactionService.getTransactionInfo(hash)
	),
	new DataSet(
		'hashLock',
		hash => TransactionService.getHashLockInfo(hash)
	)
];

const LOCK = Lock.create();

export default {
	namespaced: true,
	state: {
		...getStateFromManagers(managers),
		// If the state has been initialized.
		initialized: false
	},
	getters: {
		...getGettersFromManagers(managers),
		getInitialized: state => state.initialized,
		transactionInfo: state => state.info?.data?.transactionInfo || {},
		transactionDetail: state => state.info?.data?.transactionBody || {},
		aggregateInnerTransactions: state => state.info?.data?.innerTransactions || [],
		aggregateCosignatures: state => state.info?.data?.cosignatures || [],
		getRecentList: state => state.timeline?.data?.filter((item, index) => 4 > index) || [],
		transactionSchema: (state, getters) => ({
			loading: getters.info.loading,
			error: getters.info.error,
			data: getters.info.data?.innerTransactions
				? {
					...getters.info.data,
					...getters.transactionDetail,
					type: getters.info.data?.type,
					innerTransactions: getters.info.data.innerTransactions.map(transaction => ({
						...transaction,
						...transaction.transactionInfo,
						...transaction.transactionBody
					}))
				}
				: {
					...getters.info.data,
					...getters.transactionDetail
				}
		})
	},
	mutations: {
		...getMutationsFromManagers(managers),
		setInitialized: (state, initialized) => {
			state.initialized = initialized;
		}
	},
	actions: {
		...getActionsFromManagers(managers),

		// Initialize the transaction model. First fetch the page, then subscribe.
		async initialize ({ commit, dispatch, getters }) {
			const callback = async () => {
				await dispatch('initializePage');
				await dispatch('subscribe');
			};

			await LOCK.initialize(callback, commit, dispatch, getters);
		},

		// Uninitialize the transaction model.
		async uninitialize ({ commit, dispatch, getters }) {
			const callback = async () => {
				dispatch('unsubscribe');
				dispatch('uninitializeDetail');
				getters.timeline?.uninitialize();
			};

			await LOCK.uninitialize(callback, commit, dispatch, getters);
		},

		// Subscribe to the latest transactions.
		async subscribe ({ commit, dispatch, getters }) {
			// TODO(ahuszagh) Implement...
		},

		// Unsubscribe from the latest transactions.
		unsubscribe ({ commit, getters }) {
			let subscription = getters.getSubscription;

			if (2 === subscription?.length) {
				subscription[1].unsubscribe();
				subscription[0].close();
				commit('setSubscription', null);
			}
		},

		// Add transaction to latest transactions.
		add ({ commit }, item) {
			// TODO(ahuszagh) Also need to rework this.
			// Need to consider transaction type.
			//      commit('chain/setTransactionHash', item.transactionHash, { root: true })
			//      commit('addLatestItem', item)
		},

		// Fetch data from the SDK and initialize the page.
		initializePage (context) {
			context.getters.timeline.setStore(context).initialFetch();
		},

		async getTransactionInfoByHash (context, payload) {
			context.dispatch('uninitializeDetail');
			await context.getters.info.setStore(context).initialFetch(payload.transactionHash);

			const hashLockDataSet = context.getters.hashLock.setStore(context);

			// fetch Hash lock info when transaction type is aggregate bonded transaction
			if (context.getters.transactionDetail.transactionType === TransactionType.AGGREGATE_BONDED)
				hashLockDataSet.initialFetch(payload.transactionHash);
		},

		uninitializeDetail (context) {
			context.getters.info.setStore(context).uninitialize();
			context.getters.hashLock.setStore(context).uninitialize();
		}
	}
};
