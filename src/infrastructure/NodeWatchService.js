import globalConfig from '../config/globalConfig';
import Axios from 'axios';

class NodeWatchService {
	static async getNodes(onlySSL = false, limit = 0) {
		try {
			const [apiNodesResponse, peerNodesResponse] = await Promise.all([
				Axios.get(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/api?only_ssl=` + onlySSL + '&limit=' + limit),
				Axios.get(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/peer?only_ssl=` + onlySSL + '&limit=' + limit)
			]);

			return [...apiNodesResponse.data, ...peerNodesResponse.data];
		} catch (error) {
			console.error('Error fetching nodes:', error);
			throw error;
		}
	}

	static async getNodeByMainPublicKey(mainPublicKey) {
		try {
			const response = await Axios.get(`${globalConfig.endpoints.nodeWatch}/api/symbol/nodes/mainPublicKey/${mainPublicKey}`);
			return response.data;
		} catch (error) {
			console.error('Error fetching node by main public key:', error);
			throw error;
		}
	}
}

export default NodeWatchService;
