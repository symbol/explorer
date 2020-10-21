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

import http from './http';
import Constants from '../config/constants';
import * as symbol from 'symbol-sdk';
import Axios from 'axios';
import moment from 'moment';

class NodeService {
    /**
     * Get Storage Info from symbol SDK
     * @returns StorageInfo
     */
    static getStorageInfo = () => {
    	return http.createRepositoryFactory.createNodeRepository()
    		.getStorageInfo()
    		.toPromise();
    }

    /**
     * Get Node Info from symbol SDK
     * @returns NodeInfo
     */
    static getNodeInfo = () => {
    	return http.createRepositoryFactory.createNodeRepository()
    		.getNodeInfo()
    		.toPromise();
    }

    /**
     * Get Server Info from symbol SDK
     * @returns ServerInfo
     */
    static getServerInfo = () => {
    	return http.node.getServerInfo().toPromise();
    }

    /**
     * Get Node Peers from symbol SDK
     * @returns NodeInfo[]
     */
    static getNodePeers = async () => {
    	let nodePeers = [];

    	try {
    		nodePeers = (await Axios.get(globalConfig.endpoints.statisticsService + '/nodes')).data;
    	}
    	catch (e) {
    		nodePeers = await http.createRepositoryFactory.createNodeRepository()
    			.getNodePeers()
    			.toPromise();
    	}

    	const formattedNodePeers = nodePeers.map(nodeInfo => this.formatNodeInfo(nodeInfo));

    	return formattedNodePeers;
    }

    /**
     * Get node health status by endpoint.
     * @param string api-node endpoint such as http:localhost:3000
     * @returns boolean
     */
    static isNodeActive = async (currentUrl) => {
    	let status = true;

    	try {
    		await new symbol.NodeHttp(currentUrl).getNodeHealth()
    			.toPromise();
    	}
    	catch (e) {
    		status = false;
    	}

    	return status;
    }

    /**
     * Format NodoInfoDTO to readable NodoInfo object
     * @param NodoInfoDTO
     * @returns Object readable NodeInfo object
     */
    static formatNodeInfo = nodeInfo => ({
    	...nodeInfo,
    	nodePublicKey: nodeInfo.publicKey,
    	address: symbol.Address.createFromPublicKey(nodeInfo.publicKey, nodeInfo.networkIdentifier).plain(),
    	rolesRaw: nodeInfo.roles,
    	roles: Constants.RoleType[nodeInfo.roles],
    	network: Constants.NetworkType[nodeInfo.networkIdentifier],
    	apiEndpoint:
            nodeInfo.roles === 2 ||
            nodeInfo.roles === 3 ||
            nodeInfo.roles === 6 ||
            nodeInfo.roles === 7
            	? 'http://' + nodeInfo.host + ':' + (globalConfig.apiNodePort || 3000)
            	: Constants.Message.UNAVAILABLE
    })

    /**
     * Format Node Peers dataset into Vue Component
     * @returns Node peers object for Vue component
     */
    static getNodePeerList = async (filter) => {
    	let nodePeers = await this.getNodePeers();

    	return {
    		data:
                nodePeers
                	.filter(el => filter.rolesRaw === null || el.rolesRaw === filter.rolesRaw)
                	.map((el, index) => ({
                		index: index + 1,
                		...el
                	}))
    	};
    }

    static getNodeInfo = async (publicKey) => {
    	let node = {};

    	try {
    		node = (await Axios.get(globalConfig.endpoints.statisticsService + '/nodes/' + publicKey)).data;
    	}
    	catch (e) {
    		const nodes = (await Axios.get(http.nodeUrl + '/node/peers')).data;

    		node = nodes.find(n => n.publicKey === publicKey);
    	}
    	const formattedNodePeers = this.formatNodeInfo(node);

    	if (formattedNodePeers.rolesRaw === 2 ||
            formattedNodePeers.rolesRaw === 3 ||
            formattedNodePeers.rolesRaw === 6 ||
            formattedNodePeers.rolesRaw === 7
    	) {
    		const status = await this.getApiNodeStatus(formattedNodePeers.apiEndpoint);

    		formattedNodePeers.apiStatus = status;

    		const chainInfo = await this.getNodeChainInfo(formattedNodePeers.apiEndpoint);

    		formattedNodePeers.chainInfo = chainInfo;
    	}
    	if (formattedNodePeers?.peerStatus)
    		formattedNodePeers.peerStatus.lastStatusCheck = moment(formattedNodePeers.peerStatus.lastStatusCheck).format('YYYY-MM-DD HH:mm:ss');
    	return formattedNodePeers;
    }

    static getApiNodeStatus = async (nodeUrl) => {
    	const status = {
    		connectionStatus: false,
    		databaseStatus: Constants.Message.UNAVAILABLE,
    		apiNodeStatus: Constants.Message.UNAVAILABLE,
    		lastStatusCheck: moment().format('YYYY-MM-DD HH:mm:ss')
    	};

    	try {
    		const nodeStatus = (await Axios.get(nodeUrl + '/node/health')).data.status;

    		status.connectionStatus = true;
    		status.apiNodeStatus = nodeStatus.apiNode === 'up';
    		status.databaseStatus = nodeStatus.db === 'up';
    		status.lastStatusCheck = moment().format('YYYY-MM-DD HH:mm:ss');
    	}
    	catch (e) {
    		console.error('Failed to get node status', e);
    	};

    	return status;
    }

    static getNodeChainInfo = async (nodeUrl) => {
    	let chainInfo = {};

    	try {
    		chainInfo = {};
    		const nodeChainInfo = (await Axios.get(nodeUrl + '/chain/info')).data;

    		chainInfo.height = nodeChainInfo.height;
    		chainInfo.scoreHigh = nodeChainInfo.scoreHigh;
    		chainInfo.scoreLow = nodeChainInfo.scoreLow;
    		chainInfo.finalizationEpoch = nodeChainInfo.latestFinalizedBlock.finalizationEpoch;
    		chainInfo.finalizationPoint = nodeChainInfo.latestFinalizedBlock.finalizationPoint;
    		chainInfo.finalizedHeight = nodeChainInfo.latestFinalizedBlock.height;
    		chainInfo.finalizedHash = nodeChainInfo.latestFinalizedBlock.hash;
    	}
    	catch (e) {
    		console.error('Failed to get node chain info', e);
    	};

    	return chainInfo;
    }
}

export default NodeService;
