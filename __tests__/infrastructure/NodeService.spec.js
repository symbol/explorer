import { NodeService } from '../../src/infrastructure';
import http from '../../src/infrastructure/http';
import TestHelper from '../TestHelper';

describe('Node Service', () => {
	// Arrange:
	const {
		generateNodePeerStatus,
		generateNodeApiStatus,
		nodeCommonField
	} = TestHelper;

	const statisticServiceNodeResponse = [
		{
			roles: 1,
			peerStatus: generateNodePeerStatus(true),
			...nodeCommonField
		},
		{
			roles: 2,
			apiStatus: generateNodeApiStatus(false),
			...nodeCommonField
		},
		{
			roles: 3,
			peerStatus: generateNodePeerStatus(true),
			apiStatus: generateNodeApiStatus(false),
			...nodeCommonField
		},
		{
			roles: 3,
			peerStatus: generateNodePeerStatus(true),
			apiStatus: generateNodeApiStatus(true),
			...nodeCommonField
		},
		{
			roles: 3,
			peerStatus: generateNodePeerStatus(false),
			apiStatus: generateNodeApiStatus(false),
			...nodeCommonField
		},
		{
			roles: 5,
			peerStatus: generateNodePeerStatus(true),
			...nodeCommonField
		},
		{
			roles: 5,
			peerStatus: generateNodePeerStatus(false),
			...nodeCommonField
		},
		{
			roles: 7,
			peerStatus: generateNodePeerStatus(true),
			apiStatus: generateNodeApiStatus(true),
			...nodeCommonField
		}
	];

	const runStatisticServiceFailResponseTests = (statisticServiceMethod, NodeServiceMethod) => {
		it('throws error when statistic services fail response', async () => {
			// Arrange:
			const error = new Error(`Statistics service ${statisticServiceMethod} error`);

			http.statisticServiceRestClient = jest.fn().mockImplementation(() => {
				return {
					[statisticServiceMethod]: jest.fn().mockRejectedValue(error)
				};
			});

			// Act + Assert:
			await expect(NodeService[NodeServiceMethod]()).rejects.toThrow(error);
		});
	};

	describe('getAvailableNodes', () => {
		it('returns available node from statistic services', async () => {
			// Arrange:
			http.statisticServiceRestClient = jest.fn().mockImplementation(() => {
				return {
					getNodes: jest.fn().mockResolvedValue(statisticServiceNodeResponse)
				};
			});

			const expectNodeFormattedCommonField = {
				network: 'MAINNET',
				address: 'NDY2CXBR6SK3G7UWVXZT6YQTVJKHKFMPU74ZOYY',
				nodePublicKey:
					'016DC1622EE42EF9E4D215FA1112E89040DD7AED83007283725CE9BA550272F5',
				version: '1.0.3.5'
			};

			// Act:
			const result = await NodeService.getAvailableNodes();

			// Assert:
			expect(result).toEqual([
				{
					...nodeCommonField,
					...expectNodeFormattedCommonField,
					apiEndpoint: 'N/A',
					roles: 'Peer node',
					rolesRaw: 1,
					peerStatus: generateNodePeerStatus(true)
				},
				{
					...nodeCommonField,
					...expectNodeFormattedCommonField,
					apiEndpoint: 'localhost.com',
					roles: 'Peer Api node',
					rolesRaw: 3,
					peerStatus: generateNodePeerStatus(true),
					apiStatus: generateNodeApiStatus(false)
				},
				{
					...nodeCommonField,
					...expectNodeFormattedCommonField,
					apiEndpoint: 'localhost.com',
					roles: 'Peer Api node',
					rolesRaw: 3,
					peerStatus: generateNodePeerStatus(true),
					apiStatus: generateNodeApiStatus(true)
				},
				{
					...nodeCommonField,
					...expectNodeFormattedCommonField,
					apiEndpoint: 'N/A',
					roles: 'Peer Voting node',
					rolesRaw: 5,
					peerStatus: generateNodePeerStatus(true)
				},
				{
					...nodeCommonField,
					...expectNodeFormattedCommonField,
					apiEndpoint: 'localhost.com',
					roles: 'Peer Api Voting node',
					rolesRaw: 7,
					peerStatus: generateNodePeerStatus(true),
					apiStatus: generateNodeApiStatus(true)
				}
			]);
		});

		runStatisticServiceFailResponseTests('getNodes', 'getAvailableNodes');
	});

	describe('getNodeStats', () => {
		it('return nodes count with 7 types of roles', async () => {
			// Arrange:
			http.statisticServiceRestClient = jest.fn().mockImplementation(() => {
				return {
					getNodes: jest.fn().mockResolvedValue(statisticServiceNodeResponse)
				};
			});

			// Act:
			const nodeStats = await NodeService.getNodeStats();

			// Assert:
			expect(nodeStats).toEqual({
				1: 1,
				2: 0,
				3: 2,
				4: 0,
				5: 1,
				6: 0,
				7: 1
			});
		});
	});

	describe('getNodeInfo', () => {
		// Arrange:
		Date.now = jest.fn(() => new Date('2023-02-21'));

		const expectedPeerStatus = {
			connectionStatus: true,
			lastStatusCheck: '2023-02-19 12:30:16'
		};

		const expectedAPIStatus = {
			apiNodeStatus: true,
			connectionStatus: false,
			databaseStatus: true,
			isHttpsEnabled: true,
			lastStatusCheck: '2023-02-21 00:00:00',
			restVersion: '2.4.2'
		};

		const expectedChainInfoStatus = {
			height: 2027193,
			finalizedHeight: 2031992,
			finalizationEpoch: 1413,
			finalizationPoint: 7,
			finalizedHash: '6B687D9B689611C90A1094A7430E78914F22A2570C80D3E42D520EB08091A973',
			lastStatusCheck: '2023-02-21 00:00:00'
		};

		const assertNodeStatus = async (node, expectedResult) => {
			// Arrange:
			http.statisticServiceRestClient = jest.fn().mockImplementation(() => {
				return {
					getNode: jest.fn().mockResolvedValue(node)
				};
			});

			// Act:
			const { apiStatus, chainInfo, peerStatus } =
				await NodeService.getNodeInfo(node.publicKey);

			// Assert:
			expect(apiStatus).toEqual(expectedResult.apiStatus);
			expect(chainInfo).toEqual(expectedResult.chainInfo);
			expect(peerStatus).toEqual(expectedResult.peerStatus);
		};

		it('returns peer node status when peer status is present', async () => {
			await assertNodeStatus(statisticServiceNodeResponse[0], {
				peerStatus: expectedPeerStatus,
				apiStatus: {},
				chainInfo: {}
			});
		});

		it('returns api node status and chain info when api status is present', async () => {
			await assertNodeStatus(statisticServiceNodeResponse[1], {
				peerStatus: {},
				apiStatus: expectedAPIStatus,
				chainInfo: expectedChainInfoStatus
			});
		});

		it('returns chain info, api and peer node status when both status is present', async () => {
			await assertNodeStatus(statisticServiceNodeResponse[2], {
				peerStatus: expectedPeerStatus,
				apiStatus: expectedAPIStatus,
				chainInfo: expectedChainInfoStatus
			});
		});

		runStatisticServiceFailResponseTests('getNode', 'getNodeInfo');
	});
});
