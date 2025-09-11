import globalConfig from '../config/globalConfig';
import Axios from 'axios';

class NodeWatchService {
	static async getNodes(onlySSL = false, limit = 0, order = null) {
		const params = `only_ssl=${onlySSL}&limit=${limit}${order ? `&order=${order}` : ''}`;

		const [apiNodesResponse, peerNodesResponse] = await Promise.all([
			this.get(`/api/symbol/nodes/api?${params}`),
			this.get(`/api/symbol/nodes/peer?${params}`)
		]);

		return [...apiNodesResponse.data, ...peerNodesResponse.data];
	}

	static async getNodeByMainPublicKey(mainPublicKey) {
		const response = await this.get(`/api/symbol/nodes/mainPublicKey/${mainPublicKey}`);

		return response.data;
	}

	static async getNodeCount() {
		const response = await this.get('/api/symbol/nodes/count');
		return response.data;
	}

	static async get(route) {
		try {
			const response = await Axios.get(`${globalConfig.endpoints.nodeWatch}${route}`);
			return response;
		} catch (error) {
			console.error('Error fetching nodes:', error);
			throw Error(`Error fetching from ${route}`);
		}
	}
}

export default NodeWatchService;
