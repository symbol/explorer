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
import helper from '../helper';
import moment from 'moment';
import * as symbol from 'symbol-sdk';

class NodeService {
    /**
     * Get Storage Info from symbol SDK.
     * @returns {object} StorageInfo
     */
    static getStorageInfo = () => {
    	return http.createRepositoryFactory.createNodeRepository()
    		.getStorageInfo()
    		.toPromise();
    }

    /**
     * Get Node Info from symbol SDK.
     * @returns {object} NodeInfo
     */
    static getCurrentNodeInfo = () => {
    	return http.createRepositoryFactory.createNodeRepository()
    		.getNodeInfo()
    		.toPromise();
    }

    /**
     * Get Node Peers from symbol SDK.
     * @returns {array} NodeInfo[]
     */
    static getNodePeers = async () => {
    	let nodePeers = [];

    	try {
    		nodePeers = await http.statisticServiceRestClient().getNodes();
    	} catch (e) {
    		console.error('Statistics service getNodes error: ', e);
    	}

    	return nodePeers
    		.map(nodeInfo => this.formatNodeInfo(nodeInfo))
    		.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
    }

    /**
     * Get node health status by endpoint.
     * @param {string} currentUrl api-node endpoint such as http:localhost:3000
     * @returns {boolean} boolean
     */
    static isNodeActive = async currentUrl => {
    	let status = true;

    	try {
    		await new symbol.NodeHttp(currentUrl).getNodeHealth()
    			.toPromise();
    	} catch (e) {
    		status = false;
    	}

    	return status;
    }

    /**
     * Format NodeInfoDTO to readable NodeInfo object.
     * @param {object} nodeInfo NodeInfoDTO.
     * @returns {object} readable NodeInfo.
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
            2 === nodeInfo.roles ||
            3 === nodeInfo.roles ||
            6 === nodeInfo.roles ||
            7 === nodeInfo.roles
            	? nodeInfo.apiStatus.restGatewayUrl
            	: Constants.Message.UNAVAILABLE
    })

    /**
     * Format Node Peers dataset into Vue Component.
	 * @param {string} filter role filter.
     * @returns {object} Node peers object for Vue component.
     */
    static getNodePeerList = async filter => {
    	let nodePeers = await this.getNodePeers();

    	return {
    		data:
                nodePeers
                	.filter(el => !filter.rolesRaw || el.rolesRaw === filter.rolesRaw)
                	.map(el => {
                		let node = {
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
                		} else { node['chainInfo'] = {}; }

                		if (node?.hostDetail) {
                			node = { ...node, ...node.hostDetail };
                			delete node.hostDetail;
                		}

                		return node;
                	})
    	};
    }

    static getNodeInfo = async publicKey => {
    	let node = {};

    	try {
    		node = await http.statisticServiceRestClient().getNode(publicKey);
    	} catch (e) {
    		throw Error('Statistics service getNode error: ', e);
    	}
    	const formattedNode = this.formatNodeInfo(node);

    	if (2 === formattedNode.rolesRaw ||
            3 === formattedNode.rolesRaw ||
            6 === formattedNode.rolesRaw ||
            7 === formattedNode.rolesRaw
    	) {
    		const {
    			finalization,
    			chainHeight,
    			lastStatusCheck,
    			nodeStatus,
    			isAvailable,
    			isHttpsEnabled,
    			restVersion
    		} = formattedNode.apiStatus;

    		// // Api status
    		formattedNode.apiStatus = {
    			connectionStatus: isAvailable,
    			databaseStatus: 'up' === nodeStatus?.db || Constants.Message.UNAVAILABLE,
    			apiNodeStatus: 'up' === nodeStatus?.apiNode || Constants.Message.UNAVAILABLE,
    			isHttpsEnabled,
    			restVersion,
    			lastStatusCheck: moment.utc(lastStatusCheck).format('YYYY-MM-DD HH:mm:ss')
    		};

    		if (finalization && chainHeight) {
    			// Chain info
    			formattedNode.chainInfo = {
    				height: chainHeight,
    				finalizedHeight: finalization?.height,
    				finalizationEpoch: finalization?.epoch,
    				finalizationPoint: finalization?.point,
    				finalizedHash: finalization?.hash,
    				lastStatusCheck: moment.utc(lastStatusCheck).format('YYYY-MM-DD HH:mm:ss')
    			};
    		} else { formattedNode.chainInfo = {}; }
    	}
    	if (formattedNode?.peerStatus)
    		formattedNode.peerStatus.lastStatusCheck = moment(formattedNode.peerStatus.lastStatusCheck).format('YYYY-MM-DD HH:mm:ss');
    	return formattedNode;
    }

	static getNodeStats = async () => {
		try {
			return await http.statisticServiceRestClient().getNodeStats();
		} catch (e) {
			throw Error('Statistics service getNodeStats error: ', e);
		}
	}

	static getNodeHeightStats = async () => {
		try {
			const data = await http.statisticServiceRestClient().getNodeHeightStats();

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
		} catch (e) {
			throw Error('Statistics service getNodeHeightStats error: ', e);
		}
	}

	static getNodeListCSV = async filter => {
		const nodes = await this.getNodePeerList(filter);

		const formattedData = nodes.data.map((node, index) => ({
			no: index + 1,
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
     * Gets node list from statistics service.
	 * @param {string} filter (optional) 'preferred | suggested'.
	 * @param {number} limit (optional) number of records.
	 * @param {boolean} ssl (optional) return ssl ready node.
     * @returns {array} nodes
     */
	 static getNodeList = async (filter, limit, ssl) => {
    	try {
	 		return await http.statisticServiceRestClient().getNodes(filter, limit, ssl);
    	} catch (e) {
	 		throw Error('Statistics service getNodeHeightStats error: ', e);
	 	}
	 }

	 /**
     * Get API node list dataset into Vue Component.
     * @returns {array} API Node list object for Vue component.
     */
	 static getAPINodeList = async () => {
	 	// get 30 ssl ready nodes from statistics service the list
    	const nodes = await this.getNodeList('suggested', 30, true);

	 	return nodes.map(nodeInfo => this.formatNodeInfo(nodeInfo)).sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
	 }
}

export default NodeService;
