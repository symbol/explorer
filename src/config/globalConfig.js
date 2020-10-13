const globalConfig = window.globalConfig;

if (!window.globalConfig)
	throw new Error('NO GLOBAL CONFIG');

export default globalConfig;
