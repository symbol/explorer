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
			roles: 1,
			restVersion: null,
			isHealthy: null,
			isSslEnabled: null,
			...nodeCommonField
		},
		{
			roles: 1, // Peer node (light)
			restVersion: '2.4.4',
			isHealthy: null,
			isSslEnabled: true,
			...nodeCommonField
		},
		{
			roles: 3,
			restVersion: '2.4.4',
			isHealthy: true,
			isSslEnabled: true,
			...nodeCommonField
		},
		{
			roles: 5, // Peer Voting node (light)
			restVersion: '2.4.4',
			isHealthy: null,
			isSslEnabled: true,
			...nodeCommonField
		},
		{
			roles: 5,
			restVersion: null,
			isHealthy: null,
			isSslEnabled: null,
			...nodeCommonField
		},
		{
			roles: 7,
			restVersion: '2.4.4',
			isHealthy: true,
			isSslEnabled: true,
			...nodeCommonField
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

	const runNodeWatchFailResponseTests = (nodeWatchMethod, NodeServiceMethod) => {
		it('throws error when node watch fail response', async () => {
			// Arrange:
			const error = new Error(`node watch ${nodeWatchMethod} error`);

			jest.spyOn(NodeWatchService, nodeWatchMethod).mockRejectedValue(error);

			// Act + Assert:
			await expect(NodeService[NodeServiceMethod]()).rejects.toThrow(error);
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

		runNodeWatchFailResponseTests('getNodes', 'getAvailableNodes');
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

		runNodeWatchFailResponseTests('getNodeByMainPublicKey', 'getNodeInfo');
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
});
