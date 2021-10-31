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
import helper from '../helper';
import globalConfig from '../config/globalConfig';

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
    static getCurrentNodeInfo = () => {
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
    		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length)
    			nodePeers = (await Axios.get(globalConfig.endpoints.statisticsService + '/nodes')).data;
    		else
    			throw Error('Statistics service endpoint is not provided');
    	}
    	catch (e) {
    		nodePeers = await http.createRepositoryFactory.createNodeRepository()
    			.getNodePeers()
    			.toPromise();
    	}

    	const formattedNodePeers = nodePeers.map(nodeInfo => this.formatNodeInfo(nodeInfo)).sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

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
    	version: helper.formatNodeVersion(nodeInfo.version),
    	apiEndpoint:
            nodeInfo.roles === 2 ||
            nodeInfo.roles === 3 ||
            nodeInfo.roles === 6 ||
            nodeInfo.roles === 7
            	? nodeInfo.apiStatus.restGatewayUrl
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
                	.filter(el => !filter.rolesRaw || el.rolesRaw === filter.rolesRaw)
                	.map((el, index) => {
                		let node = {
                			index: index + 1,
                			...el
                		};

                		node['softwareVersion'] = { version: el.version };

                		if (el.apiStatus) {
                			const { chainHeight, finalization, lastStatusCheck, restVersion, isHttpsEnabled } = el.apiStatus;

                			node['chainInfo'] = {
                				chainHeight,
                				finalizationHeight: finalization?.height,
                				lastStatusCheck
                			};

                			node['softwareVersion'] = {
                				...node.softwareVersion,
                				restVersion,
                				isHttpsEnabled
                			};
                		}
                		else
                			node['chainInfo'] = {};

                		if (node?.hostDetail) {
                			node = { ...node, ...node.hostDetail };
                			delete node.hostDetail;
                		}

                		return node;
                	})
    	};
    }

	static getNodeStats = async () => {
		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length)
			return (await Axios.get(globalConfig.endpoints.statisticsService + '/nodestats/')).data;
		else
			throw Error('Statistics service endpoint is not provided');
	}

    static getNodeInfo = async (publicKey) => {
    	let node = {};

    	try {
    		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length)
    			node = (await Axios.get(globalConfig.endpoints.statisticsService + '/nodes/' + publicKey)).data;
    		else
    			throw Error('Statistics service endpoint is not provided');
    	}
    	catch (e) {
    		const nodes = (await Axios.get(http.nodeUrl + '/node/peers')).data;

    		node = nodes.find(n => n.publicKey === publicKey);
    	}
    	const formattedNode = this.formatNodeInfo(node);

    	if (formattedNode.rolesRaw === 2 ||
            formattedNode.rolesRaw === 3 ||
            formattedNode.rolesRaw === 6 ||
            formattedNode.rolesRaw === 7
    	) {
    		const { finalization, chainHeight, lastStatusCheck, nodeStatus, isAvailable, isHttpsEnabled, restVersion } = formattedNode.apiStatus;

    		// // Api status
    		formattedNode.apiStatus = {
    			connectionStatus: isAvailable,
    			databaseStatus: nodeStatus?.db === 'up' || Constants.Message.UNAVAILABLE,
    			apiNodeStatus: nodeStatus?.apiNode === 'up' || Constants.Message.UNAVAILABLE,
    			isHttpsEnabled,
    			restVersion,
    			lastStatusCheck: moment(moment.utc(lastStatusCheck).format(), 'YYYY-MM-DD HH:mm:ss')
    		};

    		if (finalization && chainHeight) {
    			// Chain info
    			formattedNode.chainInfo = {
    				height: chainHeight,
    				finalizedHeight: finalization?.height,
    				finalizationEpoch: finalization?.epoch,
    				finalizationPoint: finalization?.point,
    				finalizedHash: finalization?.hash,
    				lastStatusCheck: moment(moment.utc(lastStatusCheck).format(), 'YYYY-MM-DD HH:mm:ss')
    			};
    		}
    		else
    			formattedNode.chainInfo = {};
    	}
    	if (formattedNode?.peerStatus)
    		formattedNode.peerStatus.lastStatusCheck = moment(formattedNode.peerStatus.lastStatusCheck).format('YYYY-MM-DD HH:mm:ss');
    	return formattedNode;
    }

    static getApiNodeStatus = async (nodeUrl) => {
    	const status = {
    		connectionStatus: false,
    		databaseStatus: Constants.Message.UNAVAILABLE,
    		apiNodeStatus: Constants.Message.UNAVAILABLE,
    		lastStatusCheck: moment().format('YYYY-MM-DD HH:mm:ss')
    	};

    	try {
    		const nodeStatus = (await Axios.get(nodeUrl + '/node/health', { timeout: 3000 })).data.status;

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
    		const nodeChainInfo = (await Axios.get(nodeUrl + '/chain/info', { timeout: 3000 })).data;

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

	static getNodeStats = async () => {
		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length)
			return (await Axios.get(globalConfig.endpoints.statisticsService + '/nodeStats')).data;
		else
			throw Error('Statistics service endpoint is not provided');
	}

	static getNodeHeightStats = async () => {
		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length) {
			const data = (await Axios.get(globalConfig.endpoints.statisticsService + '/nodeHeightStats')).data;

			return [
				{
					name: 'Height',
					data: data.height.map(el => ({ x: '' + parseInt(el.value), y: parseInt(el.count) }))
				},
				{
					name: 'Finalized Height',
					data: data.finalizedHeight.map(el => ({ x: '' + parseInt(el.value), y: parseInt(el.count) }))
				}
			];
		}
		else
			throw Error('Statistics service endpoint is not provided');
	}

	static getNodeListCSV = async (filter) => {
		const nodes = await this.getNodePeerList(filter);

		const formattedData = nodes.data.map(node => ({
			no: node.index,
			host: node.host,
			country: node.country,
			friendlyName: node.friendlyName.replace(/,/g, '_'), // prevent friendly name break in CSV
			roles: node.roles,
			network: node.network,
			networkGenerationHashSeed: node.networkGenerationHashSeed,
			nodePublicKey: node.nodePublicKey,
			chainHeight: node.chainInfo.chainHeight,
			finalizationHeight: node.chainInfo.finalizationHeight,
			version: node.version
		}));

		return helper.convertArrayToCSV(formattedData);
	}

	/**
     * Gets node list from statistics service
	 * @param filter (optional) 'preferred | suggested'
	 * @param limit (optional) number of records
	 * @param ssl (optional) return ssl ready node.
     * @returns nodes
     */
	 static getNodeList = async (filter, limit = 0, ssl) => {
    	let nodes = [];

    	try {
    		if (globalConfig.endpoints.statisticsService && globalConfig.endpoints.statisticsService.length) {
	 			nodes = (await Axios.get(globalConfig.endpoints.statisticsService + `/nodes`, {
	 				params: {
	 					filter,
						 limit,
						 ssl
	 				}
	 			})).data;
	 		}
    		else
    			throw Error('Statistics service endpoint is not provided');
    	}
    	catch (e) {
    		throw Error('Statistics service endpoint is not provided', e);
    	}

    	return nodes;
	 }

	 /**
     * Get API node list dataset into Vue Component
     * @returns API Node list object for Vue component
     */
	 static getAPINodeList = async () => {
		// get 30 ssl ready nodes from statistics service the list
    	const nodes = await this.getNodeList('suggested', 30, true);

	 	return nodes.map(nodeInfo => this.formatNodeInfo(nodeInfo)).sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
	 }
}

export default NodeService;
