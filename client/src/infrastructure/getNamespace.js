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

const namespaceHttp = new NamespaceHttp(window.nemServer)

class sdkNamespace {
  static getNamespacesFromAccountByAddress = async (address) => {
    const addressObj = new Address(address)
    const namespacesIds = []
    const namespaceList = await namespaceHttp
      .getNamespacesFromAccount(addressObj)
      .pipe(
        mergeMap(namespacesInfo => {
          const namespaceIds = namespacesInfo.map(x => {
            namespacesIds[x.id.toHex().toUpperCase()] = { namespaceInfo: x }
            return x.id
          })
          return namespaceHttp.getNamespacesName(namespaceIds)
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

  static getNamespaceInfoByName = async name => {
    const namespace = new NamespaceId(name)

    const namespaceService = new NamespaceService(namespaceHttp)
    const namespaceInfo = await namespaceService.namespace(namespace).toPromise()

    return format.formatNamespace(namespaceInfo)
  }
}

export default sdkNamespace
