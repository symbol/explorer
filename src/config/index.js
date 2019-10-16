import pageMenu from './menu';
import Endpoint from './endpoint';
import helper from '../helper'

// const PORT = '3000'
// const DEFAULT_DOMAIN = 'api-01.mt.us-west-2.nemtech.network'

// let defaultNode = `http://${DEFAULT_DOMAIN}:${PORT}`

// if (localStorage['defaultNode'] && helper.validURL(localStorage['defaultNode'])) {
//   defaultNode = localStorage['defaultNode']
// }

// const Endpoint = {
//   api: defaultNode,
//   getCurrentNode: () => defaultNode.replace(/(^\w+:|^)\/\//, '').replace(':' + PORT, ''),
//   ws: `ws://${DEFAULT_DOMAIN}:${PORT}`,
//   nodes: [
//     { protocol: 'http', domain: 'api-01.mt.us-west-2.nemtech.network', port: ':' + PORT },
//     { protocol: 'http', domain: '52.194.207.217', port: ':' + PORT },
//     { protocol: 'http', domain: '103.3.60.174', port: ':' + PORT },
//     { protocol: 'http', domain: '13.114.200.132', port: ':' + PORT },
//     { protocol: 'http', domain: '47.107.245.217', port: ':' + PORT }
//   ],
//   marketDataURL: 'https://min-api.cryptocompare.com/'
// }


export {
  pageMenu,
  Endpoint,
}

export default {
  pageMenu,
  Endpoint
}