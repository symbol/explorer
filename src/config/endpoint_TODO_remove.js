import peersApi from '../config/peers-api.json';
import endpoints from '../config/endpoints.json';


const DEFAULT_NODE = peersApi.defaultNode;
const MARKET_DATA_URL = endpoints.MARKET_DATA;
const nodes = peersApi.nodes;



const getCurrentNode = (nodes) => {
    const currentNodeIndex = localStorage.getItem('currentNodeIndex');
    if(
        nodes
        &&currentNodeIndex !== null 
        && currentNodeIndex !== void 0 
        && nodes[currentNodeIndex]
    )
        return nodes[currentNodeIndex];
    else
        return DEFAULT_NODE;
} 

const setCurrentNode = (index, nodes) => {
    if(
        nodes
        &&index !== null 
        && index !== void 0 
        && nodes[index]
    ) 
        localStorage.setItem('currentNodeIndex', index);
    location.reload();
} 

const getNodes = (nodes) => {
    return nodes.map( node => {
        let url = new URL(node.url)
        return {
            protocol: url.protocol, 
            hostname: url.hostname,
            port: url.port,
            url: node.url
        }
    })
}

const getCurrentNodeHostname = (nodes) => {
    return new URL (getCurrentNode(nodes).url).hostname
}



class Endpoint {
    constructor () {
        console.log(window.config)
        this.nodes = window.config?.nodes 
            ? window.config.nodes 
            : nodes;
    }
    get currentNode() { return getCurrentNode(this.nodes) }
    get currentNodeHostname() { return getCurrentNodeHostname(this.nodes) }
    setCurrentNodeByIndex(index) { return setCurrentNode(index, this.nodes) }

    get nodesFormatted() { return getNodes(this.nodes) }

    get ws() { return (
            getCurrentNode().url.replace('http', 'ws')
        )
    }

    get marketDataURL() { return MARKET_DATA_URL }

    get api() { return (
            console.log("store", store)
            //getCurrentNode().url 
        )
    }
}

export default {
    get api() {
        console.log("store", window.store?.getters['api/currentNode']?.url);
        return window.store?.getters['api/currentNode']?.url
    }
}
//new Endpoint;