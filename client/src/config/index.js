import {
  NamespaceId,
  MosaicInfo,
  NamespaceInfo,
  PublicAccount,
  UInt64,
  MosaicId,
  NetworkType,
  NamespaceName,
  MosaicFlags
} from 'nem2-sdk'

const PORT = '3000';
let defaultNode = 'http://52.194.207.217:' + PORT;


if (localStorage['defaultNode'] && validURL(localStorage['defaultNode'])) {
  defaultNode = localStorage['defaultNode']
}

export const Endpoint = {
  api: defaultNode,
  getCurrentNode: () => defaultNode.replace(/(^\w+:|^)\/\//, '').replace(':' + PORT, ''),
  ws: 'ws://47.107.245.217:' + PORT,
  nodes: [
    { protocol: 'http', domain: '52.194.207.217', port: ':' + PORT },
    { protocol: 'http', domain: '103.3.60.174',   port: ':' + PORT },
    { protocol: 'http', domain: '13.114.200.132', port: ':' + PORT },
    { protocol: 'http', domain: '47.107.245.217', port: ':' + PORT }
  ],
  marketDataURL: 'https://min-api.cryptocompare.com/'
}

export const pageMenu = {
  items: [
    { to: "/", text: "Home", classname: "ico-th-large" },
    { to: "/blocks", text: "Blocks", classname: "ico-content-34" },
    { to: '/transactions', text: 'Transactions', classname: 'ico-line-awesome-3' },
    // { to: '/account', text: 'Accounts', classname: 'ico-user-outline' },
    // { to: '/namespace', text: 'Namespaces', classname: 'ico-data' },
    // { to: '/mosaic', text: 'Mosaics', classname: 'ico-tags' },
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


// Temporary DTO Because MosaicHttp and NamespaceHttp Break
const rootNamespaceDTO = {
  meta: {
    active: true,
    id: '59FDFC333F17CF0001774EC0',
    index: 0,
  },
  namespace: {
    depth: 1,
    endHeight: new UInt64([4294967295, 4294967295]),
    level0: new NamespaceId([929036875, 2226345261]),
    owner: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
    parentId: new NamespaceId([0, 0]),
    startHeight: new UInt64([1, 0]),
    type: 0,
    alias: { type: 1, mosaicId: new MosaicId([481110499, 231112638]) },
  },
};
const subNamespaceDTO = {
  meta: {
    active: true,
    index: 4,
    id: '59DFBA84B2E9E7000135E80E',
  },
  namespace: {
    type: 1,
    depth: 2,
    level0: new NamespaceId([
      3316183705,
      3829351378,
    ]),
    level1: new NamespaceId([
      1781696705,
      4157485863,
    ]),
    parentId: new NamespaceId([
      3316183705,
      3829351378,
    ]),
    owner: '846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2',
    startHeight: [
      795,
      0,
    ],
    endHeight: [
      50795,
      0,
    ],
    alias: { type: 0 },
  },
};

const namespaceNameDTO = {
  name: 'nem',
  namespaceId: new NamespaceId([929036875, 2226345261]),
  parentId: new NamespaceId([1431234233, 1324322333]),
};

export const namespaceName = new NamespaceName(
  namespaceNameDTO.namespaceId,
  namespaceNameDTO.name,
  namespaceNameDTO.parentId,
);

export const rootNamespace = new NamespaceInfo(
  rootNamespaceDTO.meta.active,
  rootNamespaceDTO.meta.index,
  rootNamespaceDTO.meta.id,
  rootNamespaceDTO.namespace.type,
  rootNamespaceDTO.namespace.depth,
  [rootNamespaceDTO.namespace.level0],
  rootNamespaceDTO.namespace.parentId,
  PublicAccount.createFromPublicKey(rootNamespaceDTO.namespace.owner, NetworkType.MIJIN_TEST),
  rootNamespaceDTO.namespace.startHeight,
  rootNamespaceDTO.namespace.endHeight,
  rootNamespaceDTO.namespace.alias)

export const subNamespace = new NamespaceInfo(
  subNamespaceDTO.meta.active,
  subNamespaceDTO.meta.index,
  subNamespaceDTO.meta.id,
  subNamespaceDTO.namespace.type,
  subNamespaceDTO.namespace.depth,
  [subNamespaceDTO.namespace.level0, subNamespaceDTO.namespace.level1],
  subNamespaceDTO.namespace.parentId,
  PublicAccount.createFromPublicKey(subNamespaceDTO.namespace.owner, NetworkType.MIJIN_TEST),
  subNamespaceDTO.namespace.startHeight,
  subNamespaceDTO.namespace.endHeight,
  subNamespaceDTO.namespace.alias,
)

// Mock data mosaicInfoDTO
const mosaicInfoDTO = {
  meta: {
    id: '59FDA0733F17CF0001772CBC',
  },
  mosaic: {
    mosaicId: new MosaicId([3646934825, 3576016193]),
    supply: new UInt64([3403414400, 2095475]),
    height: new UInt64([1, 0]),
    owner: PublicAccount.createFromPublicKey(
      'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
      NetworkType.MIJIN_TEST),
    revision: 1,
    flags: 7,
    divisibility: 3,
    duration: '1000',
  },
}
export const mosaicInfo = new MosaicInfo(
  mosaicInfoDTO.mosaic.mosaicId,
  mosaicInfoDTO.mosaic.supply,
  mosaicInfoDTO.mosaic.height,
  mosaicInfoDTO.mosaic.owner,
  mosaicInfoDTO.mosaic.revision,
  new MosaicFlags(mosaicInfoDTO.mosaic.flags),
  mosaicInfoDTO.mosaic.divisibility,
  UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
)