import defaultConfig from './default.json';

const addNodeProxyUrl = nodes => nodes.map(url => window.location.origin + '/connect/' + url);

const globalConfig = window.globalConfig || defaultConfig;

globalConfig.peersApi.nodes = addNodeProxyUrl(globalConfig.peersApi.nodes);

export default globalConfig;
