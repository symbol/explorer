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
import { NodeWatchService } from '../infrastructure';
import * as symbol from 'symbol-sdk';

class NodeService {
	/**
	 * Get Storage Info from symbol SDK.
	 * @returns {object} StorageInfo
	 */
	static getStorageInfo = () => {
		return http.createRepositoryFactory
			.createNodeRepository()
			.getStorageInfo()
			.toPromise();
	};

	/**
	 * Get Node Info from symbol SDK.
	 * @returns {object} NodeInfo
	 */
	static getCurrentNodeInfo = () => {
		return http.createRepositoryFactory
			.createNodeRepository()
			.getNodeInfo()
			.toPromise();
	};

	/**
	 * Get node health status by endpoint.
	 * @param {string} currentUrl api-node endpoint such as http:localhost:3000
	 * @returns {boolean} boolean
	 */
	static isNodeActive = async currentUrl => {
		let status = true;

		try {
			await new symbol.NodeHttp(currentUrl).getNodeHealth().toPromise();
		} catch (e) {
			status = false;
		}

		return status;
	};

	/**
	 * Format NodeInfoDTO to readable NodeInfo object.
	 * @param {object} nodeInfo NodeInfoDTO.
	 * @returns {object} readable NodeInfo.
	 */
	static formatNodeInfo = nodeInfo => {
		const { hostname, port } = '' !== nodeInfo.endpoint
			? new URL(nodeInfo.endpoint)
			: { hostname: 'N/A', port: 'N/A' };

		return {
			finalizedEpoch: nodeInfo.finalizedEpoch,
			finalizedHash: nodeInfo.finalizedHash,
			finalizedHeight: nodeInfo.finalizedHeight,
			finalizedPoint: nodeInfo.finalizedPoint,
			height: nodeInfo.height,
			mainPublicKey: nodeInfo.mainPublicKey,
			isHealthy: nodeInfo.isHealthy,
			restVersion: nodeInfo.restVersion,
			isHttpsEnabled: nodeInfo.isSslEnabled,
			friendlyName: nodeInfo.name,
			geoLocation: nodeInfo.geoLocation,
			host: hostname,
			version: nodeInfo.version,
			port,
			address: symbol.Address.createFromPublicKey(
				nodeInfo.mainPublicKey,
				http.networkType
			).plain(),
			rolesRaw: nodeInfo.roles,
			roles: [1,4,5].includes(nodeInfo.roles) && null != nodeInfo.restVersion
				? Constants.RoleType[nodeInfo.roles] + ' (light)'
				: Constants.RoleType[nodeInfo.roles],
			network: Constants.NetworkType[http.networkType],
			networkIdentifier: http.networkType,
			apiEndpoint: null != nodeInfo.restVersion ? nodeInfo.endpoint : Constants.Message.UNAVAILABLE,
			networkGenerationHashSeed: http.generationHash
		};
	};

	/**
	 * Get available node list from node watch service.
	 * @returns {array} NodeInfo[]
	 */
	static getAvailableNodes = async () => {
		try {
			const nodePeers = await NodeWatchService.getNodes();

			return nodePeers
				.map(nodeInfo => this.formatNodeInfo(nodeInfo))
				.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
		} catch (e) {
			console.error(e);
			throw Error('Failed to get available nodes');
		}
	};

	/**
	 * Format Available Node Peers dataset into Vue Component.
	 * @param {string} filter role filter.
	 * @returns {object} Node peers object for Vue component.
	 */
	static getAvailableNodeList = async filter => {
		const availableNodes = await this.getAvailableNodes();

		return {
			data: availableNodes
				.filter(el => !filter.rolesRaw || el.rolesRaw === filter.rolesRaw)
				.map(el => {
					let node = {
						...el
					};

					node['softwareVersion'] = { version: el.version };

					node['chainInfo'] = {
						chainHeight: el.height,
						finalizationHeight: el.finalizedHeight
					};

					node['softwareVersion'] = {
						...node.softwareVersion,
						restVersion: el.restVersion,
						isHttpsEnabled: el.isSslEnabled
					};

					if (node?.geoLocation) {
						node = {
							...node,
							coordinates: {
								latitude: node.geoLocation.lat,
								longitude: node.geoLocation.lon
							},
							location: node.geoLocation.city + ', ' + node.geoLocation.region + ', ' + node.geoLocation.country,
							isApiNode: null != node.restVersion
						};
						delete node.geoLocation;
					}

					return node;
				})
		};
	};

	static getNodeInfo = async publicKey => {
		try {
			const node = await NodeWatchService.getNodeByMainPublicKey(publicKey);

			const formattedNode = this.formatNodeInfo(node);

			const {
				finalizedEpoch,
				finalizedHash,
				finalizedHeight,
				finalizedPoint,
				height,
				isHealthy,
				isHttpsEnabled,
				restVersion
			} = formattedNode;

			// Chain info
			formattedNode.chainInfo = {
				height: height,
				finalizedHeight: finalizedHeight,
				finalizationEpoch: finalizedEpoch,
				finalizationPoint: finalizedPoint,
				finalizedHash: finalizedHash
			};

			formattedNode.apiStatus = {};

			// Only API nodes have database status
			if ([2, 3, 6, 7].includes(formattedNode.rolesRaw)) {
				formattedNode.apiStatus = {
					connectionStatus: isHealthy || Constants.Message.UNAVAILABLE,
					isHttpsEnabled,
					restVersion
				};
			} else {
				if (null != restVersion) {
					formattedNode.apiStatus = {
						lightNodeStatus: true,
						isHttpsEnabled,
						restVersion
					};
				}
			};

			// Map info used for create a marker in the map
			if (formattedNode?.geoLocation) {
				const { lat, lon, ...geoInfo } = formattedNode.geoLocation;

				formattedNode.mapInfo = {
					...geoInfo,
					coordinates: {
						latitude: lat,
						longitude: lon
					},
					rolesRaw: formattedNode.rolesRaw,
					isApiNode: null != formattedNode.restVersion
				};
			} else {
				formattedNode.mapInfo = {};
			}

			return formattedNode;
		} catch (e) {
			console.error(e);
			throw Error('Failed to get node info for public key ' + publicKey);
		}
	};

	static getNodeStats = async () => {
		const availableNodes = await this.getAvailableNodes();

		let nodeTypes = {};

		// 7 types of roles
		Array.from(Array(7).keys()).map(index => {
			Object.assign(nodeTypes, {
				[index + 1]: availableNodes.filter(node => node.rolesRaw === index + 1)
					.length
			});
		});

		return nodeTypes;
	};

	static getNodeHeightAndFinalizedHeightStats = async () => {
		try {
			const data = await NodeWatchService.getNodes();

			const nodesByVersion = {};

			data.forEach(node => {
				const {version} = node;

				// Initialize the array for this version if it doesn't exist yet
				if (!nodesByVersion[version]) {
					nodesByVersion[version] = {
						heights: [
							{
								height: node.height,
								count: 1
							}
						],
						finalizedHeights: [
							{
								finalizedHeight: node.finalizedHeight,
								count: 1
							}
						]
					};
				} else {
					// Check if height already exists
					const existingHeight = nodesByVersion[version].heights.find(h => h.height === node.height);
					if (existingHeight) {
						existingHeight.count++;
					} else {
						nodesByVersion[version].heights.push({
							height: node.height,
							count: 1
						});
					}

					// Check if finalized height already exists
					const existingFinalizedHeight = nodesByVersion[version]
						.finalizedHeights.find(h => h.finalizedHeight === node.finalizedHeight);
					if (existingFinalizedHeight) {
						existingFinalizedHeight.count++;
					} else {
						nodesByVersion[version].finalizedHeights.push({
							finalizedHeight: node.finalizedHeight,
							count: 1
						});
					}
				}
			});

			const result = [];

			Object.keys(nodesByVersion).forEach(version => {
				// Add height series for this version
				result.push({
					name: `${version} - Height`,
					data: nodesByVersion[version].heights.map(item => ({
						x: item.height,
						y: item.count,
						z: item.count
					}))
				});

				// Add finalized height series for this version
				result.push({
					name: `${version} - Finalized Height`,
					data: nodesByVersion[version].finalizedHeights.map(item => ({
						x: item.finalizedHeight,
						y: item.count,
						z: item.count
					}))
				});
			});

			return result;
		} catch (e) {
			throw Error('Failed to get node height stats');
		}
	};

	static getNodeListCSV = async filter => {
		const nodes = await this.getActiveNodeList(filter);

		const formattedData = nodes.data.map((node, index) => ({
			no: index + 1,
			host: node.host,
			country: node.country,
			friendlyName: node.friendlyName.replace(/,/g, '_'), // prevent friendly name break in CSV
			roles: node.roles,
			network: node.network,
			networkGenerationHashSeed: node.networkGenerationHashSeed,
			mainPublicKey: node.mainPublicKey,
			chainHeight: node.chainInfo.chainHeight,
			finalizationHeight: node.chainInfo.finalizationHeight,
			version: node.version
		}));

		return helper.convertArrayToCSV(formattedData);
	};

	/**
	 * Get API node list dataset into Vue Component.
	 * @returns {array} API Node list object for Vue component.
	 */
	static getAPINodeList = async () => {
		// get 30 ssl ready nodes from node watch service
		const nodes = await NodeWatchService.getNodes(true, 30, 'random');

		return nodes
			.filter(node => node.isHealthy && node.isSslEnabled)
			.map(nodeInfo => this.formatNodeInfo(nodeInfo))
			.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
	};
}

export default NodeService;
