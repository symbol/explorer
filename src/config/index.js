const PORT = '3000'
const DEFAULT_DOMAIN = 'api-01.mt.us-west-2.nemtech.network'

let defaultNode = `http://${DEFAULT_DOMAIN}:${PORT}`

if (localStorage['defaultNode'] && validURL(localStorage['defaultNode'])) {
  defaultNode = localStorage['defaultNode']
}

export const Endpoint = {
  api: defaultNode,
  getCurrentNode: () => defaultNode.replace(/(^\w+:|^)\/\//, '').replace(':' + PORT, ''),
  ws: `ws://${DEFAULT_DOMAIN}:${PORT}`,
  nodes: [
    { protocol: 'http', domain: 'api-01.mt.us-west-2.nemtech.network', port: ':' + PORT },
    { protocol: 'http', domain: '52.194.207.217', port: ':' + PORT },
    { protocol: 'http', domain: '103.3.60.174', port: ':' + PORT },
    { protocol: 'http', domain: '13.114.200.132', port: ':' + PORT },
    { protocol: 'http', domain: '47.107.245.217', port: ':' + PORT }
  ],
  marketDataURL: 'https://min-api.cryptocompare.com/'
}

export const pageMenu = {
  items: [
    { to: '/', text: 'Home', classname: 'ico-th-large' },
    { to: '/blocks', text: 'Blocks', classname: 'ico-content-34' },
    { to: '/transactions', text: 'Transactions', classname: 'ico-line-awesome-3' },
    // { to: '/account', text: 'Accounts', classname: 'ico-user-outline' },
    { to: '/namespaces', text: 'Namespaces', classname: 'ico-data' },
    { to: '/mosaics', text: 'Mosaics', classname: 'ico-tags' },
    // { to: '/node', text: 'Nodes', classname: 'ico-content-34' },
    // { to: '/stats', text: 'Statistics', classname: 'ico-bar-chart' },
  ]
}

function validURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return !!pattern.test(str)
}
