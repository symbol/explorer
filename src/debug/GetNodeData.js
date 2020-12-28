import response from './response.json';

export class GetNodeData {
	static fetch = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					data: JSON.parse(response)
				})
			}, 1000);
		})
	}
}