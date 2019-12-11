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

import http from './http'
import { Address, MosaicId, NamespaceId } from 'nem2-sdk'
import format from '../format'
import helper from '../helper'

class sdkMetadata {
  static getAccountMetadata = async address => {
    const addressObj = Address.createFromRawAddress(address)

    const metadatas = await http.metadata
      .getAccountMetadata(addressObj)
      .toPromise()

    return format.formatMetadatas(metadatas)
  }

  static getMosaicMetadata = async mosaicHexOrNamespace => {

    let mosaicID
    if (helper.isHexadecimal(mosaicHexOrNamespace)) {
      mosaicID = new MosaicId(mosaicHexOrNamespace)
    } else {
      let namespaceId = new NamespaceId(mosaicHexOrNamespace)
      mosaicID = await http.namespace.getLinkedMosaicId(namespaceId).toPromise()
    }
    const metadatas = await http.metadata
      .getMosaicMetadata(mosaicID)
      .toPromise()

    return format.formatMetadatas(metadatas)
  }

  static getNamespaceMetadata = async namespaceOrHex => {

    let namespace

    if (helper.isHexadecimal(namespaceOrHex)) {
      namespace = NamespaceId.createFromEncoded(namespaceOrHex)
    } else {
      namespace = new NamespaceId(namespaceOrHex)
    }

    const metadatas = await http.metadata
      .getNamespaceMetadata(namespace)
      .toPromise()

    return format.formatMetadatas(metadatas)
  }
}

export default sdkMetadata