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
import { version } from '../../package';
import globalConfig from '../config/globalConfig';
import helper from '../helper';
import { NodeService } from '../infrastructure';
import http from '../infrastructure/http';
import * as sdk from 'symbol-sdk';
import Vue from 'vue';

const LOCK = Lock.create();

export default {
	namespaced: true,

	state: {
		// If the global state has been initialized.
		initialized: false,
		nodes: [],
		currentNode: localStorage.getItem('currentNode') ? helper.parseUrl(localStorage.getItem('currentNode')) : '',
		wssEndpoint: localStorage.getItem('currentNode') |> helper.httpToWssUrl,
		marketData: helper.parseUrl(globalConfig.endpoints.marketData),
		networkType: 0,
		appVersion: version || '0'
	},

	getters: {
		getInitialized: state => state.initialized,
		nodes: state =>
			Array.isArray(state.nodes)
				? state.nodes.map(node => helper.parseUrl(node))
				: [],
		currentNode: state => state.currentNode.origin,
		currentNodeHostname: state => state.currentNode.hostname,
		wssEndpoint: state => state.wssEndpoint.origin,
		marketData: state => state.marketData.origin,
		isTestnet: state => state.networkType === sdk.NetworkType.TEST_NET,
		appVersion: state => state.appVersion
	},

	mutations: {
		setInitialized: (state, initialized) => {
			state.initialized = initialized;
		},
		mutate: (state, { key, value }) => Vue.set(state, key, value),
		currentNode: (state, payload) => {
			if (undefined !== payload) {
				const currentNode = helper.parseUrl(payload);
				const wssEndpoint = currentNode.origin |> helper.httpToWssUrl;

				localStorage.setItem('currentNode', currentNode);

				Vue.set(state, 'currentNode', currentNode);
				Vue.set(state, 'wssEndpoint', wssEndpoint);
			}
		},
		setNodes: (state, nodes) => {
			state.nodes = nodes;
		},
		networkType: (state, v) => {
			state.networkType = v;
		}
	},

	actions: {
		async initialize ({ commit, dispatch, getters }) {
			const callback = async () => {
				await dispatch('loadNodeList');

				const nodeUrl = getters['currentNode'];
				const marketDataUrl = getters['marketData'];

				await http.init(nodeUrl, marketDataUrl);

				commit('networkType', http.networkType);

				// Add data attribute for testnet
				if (http.networkType === sdk.NetworkType.TEST_NET)
					document.documentElement.setAttribute('data-network', 'testnet');

				dispatch('chain/getChainInfo', null, { root: true });
			};

			await LOCK.initialize(callback, commit, dispatch, getters);
		},

		changeNode ({ commit }, currentNodeUrl) {
			if (helper.validURL(currentNodeUrl)) {
				// Set the current node URL.
				commit('currentNode', currentNodeUrl);
				commit('setInitialized', false);
				// Uninitialize the data and re-initialize the API.
				location.reload();
			} else { throw Error('Cannot change node. URL is not valid: ' + currentNodeUrl); }
		},

		/**
		 * get Nodes list for node selector
		 */
		async loadNodeList ({ commit, getters }) {
			let nodeUrls = [];
			const nodes = await NodeService.getAPINodeList();

			nodes.map(url => {
				let endpoint = helper.parseUrl(url.apiEndpoint).origin;

				nodeUrls.push(endpoint);
			});

			commit('setNodes', nodeUrls);

			// eslint-disable-next-line
			const currentNode = getters['currentNode'];

			if (!currentNode) {
				// random select node
				const randomIndex = Math.floor(Math.random() * nodeUrls.length);

				commit('currentNode', helper.parseUrl(nodeUrls[randomIndex]));
			} else {
				if (-1 === nodeUrls.indexOf(currentNode))
					nodeUrls.push(currentNode);
			}
		}
	}
};
