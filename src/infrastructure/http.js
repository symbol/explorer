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

import store from '../store'
import * as nem from 'nem2-sdk'

export default class http {
  static get url() {
    return store.getters['api/currentNode'].url
  }

  static get account() {
    return new nem.AccountHttp(http.url)
  }

  static get block() {
    return new nem.BlockHttp(http.url)
  }

  static get chain() {
    return new nem.ChainHttp(http.url)
  }

  static get diagnostic() {
    return new nem.DiagnosticHttp(http.url)
  }

  static get mosaic() {
    return new nem.MosaicHttp(http.url)
  }

  static get mosaicService() {
    return new nem.MosaicService(http.account, http.mosaic)
  }

  static get namespace() {
    return new nem.NamespaceHttp(http.url)
  }

  static get namespaceService() {
    return new nem.NamespaceService(http.namespace)
  }

  static get network() {
    return new nem.NetworkHttp(http.url)
  }

  static get transaction() {
    return new nem.TransactionHttp(http.url)
  }
}
