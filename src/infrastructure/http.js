/*
 *
 * Copyright (c) 2019-present for symbol
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as symbol from 'symbol-sdk'
import constants from '../config/constants'

let NODE_URL
let MARKET_DATA_URL
let NETWORK_TYPE

export default class http {
  static init = async (nodeUrl, marketDataUrl) => {
    NODE_URL = nodeUrl
    MARKET_DATA_URL = marketDataUrl
    NETWORK_TYPE = await http.network.getNetworkType().toPromise() || constants.NetworkConfig.NETWORKTYPE
  }

  static get marketDataUrl() {
    return MARKET_DATA_URL
  }

  static get nodeUrl() {
    return NODE_URL
  }

  static get networkType() {
    return NETWORK_TYPE
  }

  static get account() {
    return new symbol.AccountHttp(http.nodeUrl)
  }

  static get block() {
    return new symbol.BlockHttp(http.nodeUrl)
  }

  static get chain() {
    return new symbol.ChainHttp(http.nodeUrl)
  }

  static get mosaic() {
    return new symbol.MosaicHttp(http.nodeUrl)
  }

  static get mosaicService() {
    return new symbol.MosaicService(http.account, http.mosaic)
  }

  static get namespace() {
    return new symbol.NamespaceHttp(http.nodeUrl)
  }

  static get namespaceService() {
    return new symbol.NamespaceService(http.namespace)
  }

  static get network() {
    return new symbol.NetworkHttp(http.nodeUrl)
  }

  static get transaction() {
    return new symbol.TransactionHttp(http.nodeUrl)
  }

  static get multisig() {
    return new symbol.MultisigHttp(http.nodeUrl)
  }

  static get metadata() {
    return new symbol.MetadataHttp(http.nodeUrl)
  }

  static get receipt() {
    return new symbol.ReceiptHttp(http.nodeUrl)
  }

  static get restrictionAccount() {
    return new symbol.RestrictionAccountHttp(http.nodeUrl)
  }

  static get restrictionMosaic() {
    return new symbol.RestrictionMosaicHttp(http.nodeUrl)
  }

  static get node() {
    return new symbol.NodeHttp(http.nodeUrl)
  }
}
