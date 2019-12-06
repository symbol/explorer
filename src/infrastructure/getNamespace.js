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
import { Address, NamespaceId } from 'nem2-sdk'
import { mergeMap, map } from 'rxjs/operators'
import dto from './dto'
import http from './http'
import format from '../format'
import helper from '../helper'
import Constants from '../config/constants'
import sdkMetadata from '../infrastructure/getMetadata'

const addNamespaceNames = async namespaces => {
  // Fetch the namespace name objects from the IDs.
  const namespaceIdsList = namespaces.map(namespacesInfo => namespacesInfo.id)
  const namespaceNames = await http.namespace.getNamespacesName(namespaceIdsList).toPromise()

  // Create a mapping of namespace IDs to names.
  // Allows efficient ID lookups.
  const idToNameMap = {}
  for (let item of namespaceNames) {
    idToNameMap[item.namespaceId.toHex()] = item.name
  }

  // Add name to namespace object.
  namespaces.map(info => {
    info.namespaceName = info.levels
      .map(level => idToNameMap[level.toHex()])
      .join('.')
  })
}

class sdkNamespace {
  static getNamespacesFromAccountByAddress = async (address) => {
    const namespacesIds = []
    const namespaceList = await http.namespace
      .getNamespacesFromAccount(Address.createFromRawAddress(address))
      .pipe(
        mergeMap(namespacesInfo => {
          const namespaceIds = namespacesInfo.map(x => {
            namespacesIds[x.id.toHex().toUpperCase()] = { namespaceInfo: x }
            return x.id
          })
          return http.namespace.getNamespacesName(namespaceIds)
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

    let namespaceInfo = await http.namespaceService.namespace(namespace).toPromise()
    let namespaceNames = await http.namespace.getNamespacesName([namespace]).toPromise()

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
    const path = `/namespaces/from/${namespaceId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const namespaces = response.data.map(info => dto.createNamespaceInfoFromDTO(info, http.networkType))
    await addNamespaceNames(namespaces)

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
    const path = `/namespaces/since/${namespaceId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const namespaces = response.data.map(info => dto.createNamespaceInfoFromDTO(info, http.networkType))
    await addNamespaceNames(namespaces)

    return format.formatNamespaceInfos(namespaces)
  }

  static getNamespaceInfoFormatted = async namespaceOrHex => {
    let namespaceInfo
    let namespaceLevels
    let metadataList
    let namespaceInfoFormatted

    try { namespaceInfo = await sdkNamespace.getNamespaceInfo(namespaceOrHex) } catch (e) { throw Error('Failed to fetch namespace info', e) }

    try { metadataList = await sdkMetadata.getNamespaceMetadata(namespaceOrHex) } catch (e) { console.warn(e) }

    if (namespaceInfo) {
      namespaceInfoFormatted = {
        owneraddress: namespaceInfo.owner,
        namespaceName: namespaceInfo.namespaceName,
        namespaceId: namespaceInfo.namespaceNameHexId,
        registrationType: namespaceInfo.registrationType,
        startHeight: namespaceInfo.startHeight,
        endHeight: namespaceInfo.endHeight,
        active: namespaceInfo.active,
        aliasType: namespaceInfo.aliasType,
      }

      // create alias props by alias type.
      if (namespaceInfo.aliasType === Constants.Message.ADDRESS) {
        namespaceInfoFormatted.aliasAddress = namespaceInfo.alias
      } else if (namespaceInfo.aliasType === Constants.Message.MOSAIC) {
        namespaceInfoFormatted.aliasMosaic = namespaceInfo.alias
      } else {
        namespaceInfoFormatted.alias = namespaceInfo.alias
      }

      namespaceLevels = []
      if (namespaceInfo.levels?.length) {
        namespaceInfo.levels.forEach((el) => {
          let parentId = el.parentId ? el.parentId : ''
          let namespaceLevelObject = {
            namespaceName: el.name,
            namespaceId: el.namespaceId,
            parentId: parentId === '' ? Constants.Message.UNAVAILABLE : parentId.toHex()
          }
          namespaceLevels.push(namespaceLevelObject)
        })
      }
    }

    return {
      namespaceInfo: namespaceInfoFormatted || {},
      namespaceLevels: namespaceLevels || [],
      metadataList: metadataList || []
    }
  }
}

export default sdkNamespace
