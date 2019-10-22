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

import axios from 'axios'
import { NamespaceHttp, NetworkHttp, Address, NamespaceId, NamespaceService } from 'nem2-sdk'
import { mergeMap, map } from 'rxjs/operators'
import dto from './dto'
import format from '../format'
import helper from '../helper'


let NAMESPACE_HTTP
let NETWORK_HTTP


class sdkNamespace {
  static init = async nodeUrl => {
    NAMESPACE_HTTP = new NamespaceHttp(nodeUrl)
    NETWORK_HTTP = new NetworkHttp(nodeUrl)
  }

  static getNamespacesFromAccountByAddress = async (address) => {
    const namespacesIds = []
    const namespaceList = await NAMESPACE_HTTP
      .getNamespacesFromAccount(Address.createFromRawAddress(address))
      .pipe(
        mergeMap(namespacesInfo => {
          const namespaceIds = namespacesInfo.map(x => {
            namespacesIds[x.id.toHex().toUpperCase()] = { namespaceInfo: x }
            return x.id
          })
          return NAMESPACE_HTTP.getNamespacesName(namespaceIds)
        }),
        map(namespacesNames =>
          namespacesNames.map(namespaceName => {
            const namespace =
              namespacesIds[namespaceName.namespaceId.toHex().toUpperCase()]
            namespace.namespaceName = namespaceName
            return namespace
          })
        )
      )
      .toPromise()

    return format.formatNamespaces(namespaceList)
  }

  static getNamespaceInfo = async namespaceOrHex => {
    let namespace = ''

    if (helper.isHexadecimal(namespaceOrHex)) {
      namespace = NamespaceId.createFromEncoded(namespaceOrHex)
    } else {
      namespace = new NamespaceId(namespaceOrHex)
    }

    const namespaceService = new NamespaceService(NAMESPACE_HTTP)

    let namespaceInfo = await namespaceService.namespace(namespace).toPromise()

    let namespaceNames = await NAMESPACE_HTTP.getNamespacesName([namespace]).toPromise()

    namespaceNames.map(namespace => {
      if (namespace.parentId) {
        let parent = namespaceNames.find(n => n.namespaceId.id.equals(namespace.parentId.id))
        namespace.name = parent.name + '.' + namespace.name
      }
      namespace.namespaceId = namespace.namespaceId.toHex()
    })

    return format.formatNamespace(namespaceInfo, namespaceNames)
  }

  static getNamespacesFromIdWithLimit = async (limit, fromNamespaceId) => {
    let namespaceId
    if (fromNamespaceId === undefined) {
      namespaceId = 'latest'
    } else {
      namespaceId = fromNamespaceId
    }

    // Make request.
    const networkType = await NETWORK_HTTP.getNetworkType().toPromise()
    const path = `/namespaces/from/${namespaceId}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const namespaces = response.data.map(info => dto.createNamespaceInfoFromDTO(info, networkType))

    return format.formatNamespaceInfos(namespaces)
  }

  static getNamespacesSinceIdWithLimit = async (limit, sinceNamespaceId) => {
    let namespaceId
    if (sinceNamespaceId === undefined) {
      namespaceId = 'earliest'
    } else {
      namespaceId = sinceNamespaceId
    }

    // Make request.
    const networkType = await NETWORK_HTTP.getNetworkType().toPromise()
    const path = `/namespaces/since/${namespaceId}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const namespaces = response.data.map(info => dto.createNamespaceInfoFromDTO(info, networkType))

    return format.formatNamespaceInfos(namespaces)
  }
}

export default sdkNamespace
