import globalConfig from '../../src/config/globalConfig';
import { NodeWatchService } from '../../src/infrastructure';
import Axios from 'axios';

jest.mock('axios');

describe('Node Watch Service', () => {
	describe('getNodes', () => {
		const mockApiResponse = [
			{ id: 1, name: 'Node1' },
			{ id: 2, name: 'Node2' }
		];

		const mockPeerResponse = [
			{ id: 3, name: 'PeerNode1' },
			{ id: 4, name: 'PeerNode2' }
		];

		beforeEach(() => {
			Axios.get.mockClear();

			Axios.get.mockImplementation(url => {
				if (url.includes('api/symbol/nodes/api'))
					return Promise.resolve({ data: mockApiResponse });
				else if (url.includes('api/symbol/nodes/peer'))
					return Promise.resolve({ data: mockPeerResponse });

			});
		});
		it('fetches nodes with default params', async () => {
			// Act
			const result = await NodeWatchService.getNodes();

			// Assert
			expect(result).toEqual([...mockApiResponse, ...mockPeerResponse]);
			expect(Axios.get).toHaveBeenCalledWith(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/api?only_ssl=false&limit=0`);
			expect(Axios.get).toHaveBeenCalledWith(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/peer?only_ssl=false&limit=0`);
		});

		it('fetches nodes with SSL filtering, limit 2 and order random', async () => {
			// Act
			const result = await NodeWatchService.getNodes(true, 2, 'random');

			// Assert
			expect(result).toEqual([...mockApiResponse, ...mockPeerResponse]);
			expect(Axios.get).toHaveBeenCalledWith(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/api?only_ssl=true&limit=2&order=random`);
			expect(Axios.get).toHaveBeenCalledWith(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/peer?only_ssl=true&limit=2&order=random`);
		});

		it('handles errors when fetching nodes', async () => {
			// Arrange
			Axios.get.mockRejectedValue(new Error('Network error'));

			// Act + Assert
			await expect(NodeWatchService.getNodes()).rejects.toThrow('Network error');
		});
	});

	describe('getNodeByMainPublicKey', () => {
		it('fetches node by main public key', async () => {
			// Arrange
			const mockResponse = { id: 1, name: 'Node1' };
			const mainPublicKey = 'publicKey123';

			Axios.get.mockResolvedValue({ data: mockResponse });

			// Act
			const result = await NodeWatchService.getNodeByMainPublicKey(mainPublicKey);

			// Assert
			expect(result).toEqual(mockResponse);
			expect(Axios.get).toHaveBeenCalledWith(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/mainPublicKey/${mainPublicKey}`);
		});

		it('handles errors when fetching node by main public key', async () => {
			// Arrange
			const mainPublicKey = '1234567890abcdef';
			Axios.get.mockRejectedValue(new Error('Network error'));

			// Act + Assert
			await expect(NodeWatchService.getNodeByMainPublicKey(mainPublicKey)).rejects.toThrow('Network error');
		});
	});
});