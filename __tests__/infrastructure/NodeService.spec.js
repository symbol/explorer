import { NodeService, NodeWatchService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';

describe('Node Service', () => {
	// Arrange:
	const {
		nodeCommonField,
		geoLocationCommonField
	} = TestHelper;

	const nodeWatchServiceNodeResponse = [
		{
			...nodeCommonField,
			roles: 1,
			restVersion: null,
			isHealthy: null,
			isSslEnabled: null
		},
		{
			...nodeCommonField,
			roles: 1, // Peer node (light)
			restVersion: '2.4.4',
			isHealthy: null,
			isSslEnabled: true
		},
		{
			...nodeCommonField,
			roles: 3,
			restVersion: '2.4.4',
			isHealthy: true,
			isSslEnabled: true
		},
		{
			...nodeCommonField,
			roles: 5, // Peer Voting node (light)
			restVersion: '2.4.4',
			isHealthy: null,
			isSslEnabled: true
		},
		{
			...nodeCommonField,
			roles: 5,
			restVersion: null,
			isHealthy: null,
			isSslEnabled: null
		},
		{
			...nodeCommonField,
			roles: 7,
			restVersion: '2.4.4',
			isHealthy: true,
			isSslEnabled: true
		}
	];

	const nodeFormattedCommonField = {
		network: 'TESTNET',
		networkIdentifier: 152,
		address: 'TDY2CXBR6SK3G7UWVXZT6YQTVJKHKFMPU6UDZ6Q',
		mainPublicKey:
			'016DC1622EE42EF9E4D215FA1112E89040DD7AED83007283725CE9BA550272F5',
		version: '1.0.3.5',
		friendlyName: 'node',
		finalizedEpoch: 50,
		finalizedHash: 'finalized hash',
		finalizedHeight: 100,
		finalizedPoint: 1,
		geoLocation: null,
		height: 120,
		host: 'node.com',
		port: '3000',
		networkGenerationHashSeed: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'
	};

	const runNodeServiceThrowErrorTests = (nodeServiceMethod, params, expectedError) => {
		it('throws error when node service fail response', async () => {
			// Arrange:
			jest.spyOn(NodeWatchService, 'getNodes').mockRejectedValue(new Error());
			jest.spyOn(NodeWatchService, 'getNodeByMainPublicKey').mockRejectedValue(new Error());

			// Act + Assert:
			await expect(NodeService[nodeServiceMethod](params)).rejects.toThrow(expectedError);
		});
	};

	describe('getAvailableNodes', () => {
		it('returns available node from node watch services', async () => {
			// Arrange:
			jest.spyOn(NodeWatchService, 'getNodes').mockResolvedValue(nodeWatchServiceNodeResponse);

			// Act:
			const result = await NodeService.getAvailableNodes();

			// Assert:
			expect(result).toEqual([
				{
					...nodeFormattedCommonField,
					restVersion: null,
					isHealthy: null,
					isHttpsEnabled: null,
					apiEndpoint: 'N/A',
					roles: 'Peer node',
					rolesRaw: 1
				},
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: null,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer node (light)',
					rolesRaw: 1
				},
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: true,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer Api node',
					rolesRaw: 3
				},
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: null,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer Voting node (light)',
					rolesRaw: 5
				},
				{
					...nodeFormattedCommonField,
					restVersion: null,
					isHealthy: null,
					isHttpsEnabled: null,
					apiEndpoint: 'N/A',
					roles: 'Peer Voting node',
					rolesRaw: 5
				},
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: true,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer Api Voting node',
					rolesRaw: 7
				}
			]);
		});

		runNodeServiceThrowErrorTests('getAvailableNodes', undefined, 'Failed to get available nodes');
	});

	describe('getNodeStats', () => {
		it('return nodes count with 7 types of roles', async () => {
			// Arrange:
			jest.spyOn(NodeWatchService, 'getNodes').mockResolvedValue(nodeWatchServiceNodeResponse);

			// Act:
			const nodeStats = await NodeService.getNodeStats();

			// Assert:
			expect(nodeStats).toEqual({
				1: 2,
				2: 0,
				3: 1,
				4: 0,
				5: 2,
				6: 0,
				7: 1
			});
		});
	});

	describe('getNodeInfo', () => {
		// Arrange:
		Date.now = jest.fn(() => new Date('2023-02-21'));

		const expectedChainInfoStatus = {
			height: 120,
			finalizedHeight: 100,
			finalizationEpoch: 50,
			finalizationPoint: 1,
			finalizedHash: 'finalized hash'
		};

		const assertNodeStatus = async (node, expectedResult) => {
			// Arrange:
			jest.spyOn(NodeWatchService, 'getNodeByMainPublicKey').mockResolvedValue(node);

			// Act:
			const { apiStatus, chainInfo, mapInfo } =
				await NodeService.getNodeInfo(node.mainPublicKey);

			// Assert:
			expect(apiStatus).toEqual(expectedResult.apiStatus);
			expect(chainInfo).toEqual(expectedResult.chainInfo);
			expect(mapInfo).toEqual(expectedResult.mapInfo);
		};

		it('returns API node status, chain info and map info', async () => {
			await assertNodeStatus(
				{
					...nodeWatchServiceNodeResponse[2],
					geoLocation: geoLocationCommonField
				},
				{
					apiStatus: {
						connectionStatus: true,
						isHttpsEnabled: true,
						restVersion: '2.4.4'
					},
					chainInfo: expectedChainInfoStatus,
					mapInfo: {
						city: 'ABC City',
						continent: 'ABC',
						country: 'ABC',
						isp: 'ABC Online',
						region: 'SN',
						coordinates: {
							latitude: 10.000,
							longitude: 20.000
						},
						rolesRaw: 3,
						isApiNode: true
					}
				}
			);
		});

		it('returns Peer node status info, chain info without map info', async () => {
			await assertNodeStatus(nodeWatchServiceNodeResponse[0], {
				apiStatus: {},
				chainInfo: expectedChainInfoStatus,
				mapInfo: {}
			});
		});

		const runLightRestNodeTests = lightNode => {
			it(`returns roles ${lightNode.roles} node status and light rest status`, async () => {
				await assertNodeStatus(lightNode, {
					apiStatus: {
						lightNodeStatus: true,
						isHttpsEnabled: true,
						restVersion: '2.4.4'
					},
					chainInfo: expectedChainInfoStatus,
					mapInfo: {}
				});
			});
		};

		[
			nodeWatchServiceNodeResponse[1],
			nodeWatchServiceNodeResponse[3]
		].forEach(lightNode => runLightRestNodeTests(lightNode));

		runNodeServiceThrowErrorTests('getNodeInfo', 'public key 123', 'Failed to get node info for public key public key 123');
	});

	describe('getAPINodeList', () => {
		it('returns a list of API nodes', async () => {
			// Arrange:
			jest.spyOn(NodeWatchService, 'getNodes').mockResolvedValue(nodeWatchServiceNodeResponse);

			// Act:
			const apiNodeList = await NodeService.getAPINodeList();

			// Assert:
			expect(apiNodeList).toEqual([
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: true,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer Api node',
					rolesRaw: 3
				},
				{
					...nodeFormattedCommonField,
					restVersion: '2.4.4',
					isHealthy: true,
					isHttpsEnabled: true,
					apiEndpoint: 'http://node.com:3000',
					roles: 'Peer Api Voting node',
					rolesRaw: 7
				}
			]);
		});
	});

	describe('getNodeHeightAndFinalizedHeightStats', () => {
		it('returns node height and finalized height count and group by version', async () => {
			// Arrange:
			const mockApiResponse = [
				{
					...nodeCommonField,
					version: '1.0.3.6',
					height: 120,
					finalizedHeight: 100
				},
				{
					...nodeCommonField,
					version: '1.0.3.6',
					height: 120,
					finalizedHeight: 100
				},
				{
					...nodeCommonField,
					version: '1.0.3.5',
					height: 120,
					finalizedHeight: 99
				},
				{
					...nodeCommonField,
					version: '1.0.3.5',
					height: 120,
					finalizedHeight: 100
				},
				{
					...nodeCommonField,
					version: '1.0.3.4',
					height: 120,
					finalizedHeight: 100
				}
			];

			jest.spyOn(NodeWatchService, 'getNodes').mockResolvedValue(mockApiResponse);

			// Act:
			const result = await NodeService.getNodeHeightAndFinalizedHeightStats();

			// Assert:
			expect(result).toEqual([
				{
					'data': [{'x': 120, 'y': 2, 'z': 2}],
					'name': '1.0.3.6 - Height'
				},
				{
					'data': [{'x': 100, 'y': 2, 'z': 2}],
					'name': '1.0.3.6 - Finalized Height'},
				{
					'data': [{'x': 120, 'y': 2, 'z': 2}],
					'name': '1.0.3.5 - Height'
				},
				{
					'data': [{'x': 99, 'y': 1, 'z': 1}, {'x': 100, 'y': 1, 'z': 1}],
					'name': '1.0.3.5 - Finalized Height'
				},
				{
					'data': [{'x': 120, 'y': 1, 'z': 1}],
					'name': '1.0.3.4 - Height'
				},
				{
					'data': [{'x': 100, 'y': 1, 'z': 1}],
					'name': '1.0.3.4 - Finalized Height'
				}
			]);
		});

		runNodeServiceThrowErrorTests('getNodeHeightAndFinalizedHeightStats', undefined, 'Failed to get node height stats');
	});
});
