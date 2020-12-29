import response from './response.json';

export default class GetNodeData {
	static fetch = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					data: response
				})
			}, 3000);
		})
	}
}