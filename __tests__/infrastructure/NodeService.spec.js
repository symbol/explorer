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

		it('throws error when statistic services fail response', async () => {
			// Arrange:
			const error = new Error('Statistics service getNode error');

			http.statisticServiceRestClient = jest.fn().mockImplementation(() => {
				return {
					getNodes: jest.fn().mockRejectedValue(error)
				};
			});

			// Act + Assert:
			await expect(NodeService.getAvailableNodes()).rejects.toThrow(error);
		});
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
				3: 1,
				4: 0,
				5: 1,
				6: 0,
				7: 1
			});
		});
	});
});
