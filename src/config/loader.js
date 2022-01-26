import Axios from 'axios';

const CONFIG_ROUTE = '/config';

export const loadConfig = () => Axios.get(window.location.origin + CONFIG_ROUTE)
	.then(res => {
		window.globalConfig = (null !== res.data && 'object' === typeof res.data)
			? res.data
			: undefined;
	})
	.catch(() => {});
