import helper from '../helper'

const PORT = '3000'
const DEFAULT_DOMAIN = 'api-01.mt.us-west-2.nemtech.network'
const DEFAULT_NODE = { scheme: 'http', host: DEFAULT_DOMAIN, port: PORT }

const MARKET_DATA_URL = 'https://min-api.cryptocompare.com/'

const nodes = [
    { scheme: 'http', host: 'api-01.mt.us-west-2.nemtech.network', port: PORT },
    { scheme: 'http', host: '52.194.207.217', port: PORT },
    { scheme: 'http', host: '103.3.60.174', port: PORT },
    { scheme: 'http', host: '13.114.200.132', port: PORT },
    { scheme: 'http', host: '47.107.245.217', port: PORT }
]



const getCurrentNode = () => {
    const currentNodeIndex = localStorage.getItem('currentNodeIndex');
    if(
        currentNodeIndex !== null 
        && currentNodeIndex !== void 0 
        && nodes[currentNodeIndex]
    )
        return nodes[currentNodeIndex]
    else
        return DEFAULT_NODE;
} 

const setCurrentNode = (index) => {
    if(
        index !== null 
        && index !== void 0 
        && nodes[index]
    ) 
        localStorage.setItem('currentNodeIndex', index);
    Location.reload();
} 



class Endpoint {
    constructor() {}

    get currentNode() { return getCurrentNode() }
    set currentNode(index) { return setCurrentNode(index) }

    get nodes() { return nodes }

    get ws() { return (
            getCurrentNode().scheme.replace('http', 'ws')
            + '://'
            + getCurrentNode().host
            + ':'
            + getCurrentNode().port
        )
    }

    get marketDataURL() { return MARKET_DATA_URL }

    get api() { return (
            getCurrentNode().scheme 
            + '://'
            + getCurrentNode().host
            + ':'
            + getCurrentNode().port
        )
    }
}

export default new Endpoint;