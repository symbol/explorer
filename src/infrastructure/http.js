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
    NETWORK_TYPE = await http.createRepositoryFactory.getNetworkType().toPromise() || constants.NetworkConfig.NETWORKTYPE
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

  static get createRepositoryFactory() {
    return new symbol.RepositoryFactoryHttp(this.nodeUrl)
  }

  static get mosaicService() {
    const accountRepository = this.createRepositoryFactory.createAccountRepository()
    const mosaicRepository = this.createRepositoryFactory.createMosaicRepository()
    return new symbol.MosaicService(accountRepository, mosaicRepository)
  }

  static get namespaceService() {
    const namespaceRepository = this.createRepositoryFactory.createNamespaceRepository()
    return new symbol.NamespaceService(namespaceRepository)
  }
}
