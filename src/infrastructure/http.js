/*
 *
 * Copyright (c) 2019-present for NEM
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

import * as nem from 'nem2-sdk'
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
    return new nem.AccountHttp(http.nodeUrl)
  }

  static get block() {
    return new nem.BlockHttp(http.nodeUrl)
  }

  static get chain() {
    return new nem.ChainHttp(http.nodeUrl)
  }

  static get diagnostic() {
    return new nem.DiagnosticHttp(http.nodeUrl)
  }

  static get mosaic() {
    return new nem.MosaicHttp(http.nodeUrl)
  }

  static get mosaicService() {
    return new nem.MosaicService(http.account, http.mosaic)
  }

  static get namespace() {
    return new nem.NamespaceHttp(http.nodeUrl)
  }

  static get namespaceService() {
    return new nem.NamespaceService(http.namespace)
  }

  static get network() {
    return new nem.NetworkHttp(http.nodeUrl)
  }

  static get transaction() {
    return new nem.TransactionHttp(http.nodeUrl)
  }

  static get multisig() {
    return new nem.MultisigHttp(http.nodeUrl)
  }

  static get metadata() {
    return new nem.MetadataHttp(http.nodeUrl)
  }

  static get receipt() {
    return new nem.ReceiptHttp(http.nodeUrl)
  }

  static get restrictionAccount() {
    return new nem.RestrictionAccountHttp(http.nodeUrl)
  }

  static get restrictionMosaic() {
    return new nem.RestrictionMosaicHttp(http.nodeUrl)
  }
}
