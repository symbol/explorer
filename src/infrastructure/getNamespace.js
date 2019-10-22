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

import { NamespaceHttp, Address, NamespaceId, NamespaceService } from 'nem2-sdk'
import { mergeMap, map } from 'rxjs/operators'
import format from '../format'
import helper from '../helper'
import { Endpoint } from '../config/'

let NAMESPACE_HTTP

class sdkNamespace {
  static connect = async nodeUrl => {
    NAMESPACE_HTTP = new NamespaceHttp(nodeUrl)
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
}

export default sdkNamespace
