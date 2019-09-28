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
import { Endpoint, rootNamespace, subNamespace, namespaceName } from '../config/'

const NAMESPACE_HTTP = new NamespaceHttp(Endpoint.api)

class sdkNamespace {
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

  static getNamespaceInfo = async name => {

    // TODO: Read params if hex, convert to uint64 id
    const namespace = new NamespaceId(name)
    const namespaceService = new NamespaceService(NAMESPACE_HTTP)

    // let namespaceInfo = await namespaceService.namespace(namespace).toPromise()
    let namespaceInfo = rootNamespace

    // let namespaceNames = await NAMESPACE_HTTP.getNamespacesName([namespace]).toPromise()
    let namespaceNames = [namespaceName]

    // namespaceNames.map(namespace => {
    //   if (namespace.parentId) {
    //     let parent = namespaceNames.find(n => n.namespaceId.id.equals(namespace.parentId.id))
    //     namespace.name = parent.name + '.' + namespace.name
    //   }
    // })

    // namespaceNames.map(namespace => {
    //   namespace.namespaceId = namespace.namespaceId.toHex().toUpperCase()
    //   namespace.name = namespace.name.toUpperCase()
    // })

    return format.formatNamespace(namespaceInfo, namespaceNames)
  }
}

export default sdkNamespace
