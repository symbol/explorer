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
import helper from '../helper'
import Constants from '../config/constants'

class NamespaceService {
  /**
   * Gets array of NamespaceName for different namespaceIds
   * @param namespaceIds - Array of namespace ids
   * @returns Formatted NamespaceName[]
   */
  static getNamespacesName = async (namespaceIds) => {
    let namespaceNames = await http.namespace.getNamespacesName(namespaceIds).toPromise()
    let formattedNamespacesName = namespaceNames.map(namespaceName => this.formatNamespaceName(namespaceName))

    return formattedNamespacesName
  }

  /**
   * Get namespace info and name from namespace Id
   * @param namespaceId - Namespace id
   * @returns formatted namespace info and name
   */
  static getNamespace = async (namespaceId) => {
    let namespaceInfo = await http.namespaceService.namespace(namespaceId).toPromise()
    let formattedNamespaceInfo = this.formatNamespace(namespaceInfo)

    return formattedNamespaceInfo
  }

  /**
   * Get namespace info for Vue Component
   * @param hexOrNamespace - hex value or namespace name
   * @returns Custom namespace info Object
   */
  static getNamespaceInfo = async (hexOrNamespace) => {
    let namespaceId = await helper.hexOrNamespaceToId(hexOrNamespace, 'namespace')
    let namespace = await this.getNamespace(namespaceId)
    let {
      isExpired,
      expiredInBlock,
      expiredInSecond
    } = helper.calculateNamespaceExpiration(currentHeight, namespace.endHeight)

    return {
      ...namespace,
      duration: moment.utc().add(expiredInSecond, 's').fromNow() || Constants.Message.UNLIMITED,
      isExpired: isExpired,
      approximateExpired: moment.utc().add(expiredInSecond, 's').local().format('YYYY-MM-DD HH:mm:ss'),
      expiredInBlock: expiredInBlock
    }
  }

  /**
   * Gets NamespaceName list from Vue Component
   * @param hexOrNamespace - hex value or namespace name
   * @returns Namespace name list
   */
  static getNamespaceLevelList  = async (hexOrNamespace) => {
    let namespaceId = await helper.hexOrNamespaceToId(hexOrNamespace, 'namespace')
    let namespacesName = await this.getNamespacesName([namespaceId])

    return namespacesName
  }

  /**
   * Format namespaceName to readable object
   * @param namespaceNameDTO
   * @returns readable namespaceNameDTO
   */
  static formatNamespaceName = namespaceName => ({
    ...namespaceName,
    namespaceId: namespaceName.namespaceId.toHex(),
    parentId: namespaceName?.parentId ? namespaceName.parentId.toHex() : undefined
  })

  /**
   * Format namespace to readable object
   * @param namespaceDTO
   * @returns readable namespaceDTO
   */
  static formatNamespace = namespace => {
    let aliasText
    let aliasType
    switch (namespace.alias.type) {
      case 1:
        aliasText = namespace.alias.mosaicId.toHex()
        aliasType = Constants.Message.MOSAIC
        break
      case 2:
        aliasText = namespace.alias.address.plain()
        aliasType = Constants.Message.ADDRESS
        break
      default:
        aliasText = false
        aliasType = Constants.Message.NO_ALIAS
        break
    }

    return {
      owner: namespace.owner.address.plain(),
      namespaceName: namespace.name,
      namespaceNameHexId: namespace.id.toHex().toUpperCase(),
      registrationType: Constants.NamespaceRegistrationType[namespace.registrationType],
      startHeight: namespace.startHeight.compact(),
      endHeight: Constants.NetworkConfig.NAMESPACE.indexOf(namespace.name.toUpperCase()) !== -1
        ? Constants.Message.INFINITY
        : namespace.endHeight.compact(),
      active: namespace.active ? Constants.Message.ACTIVE : Constants.Message.INACTIVE,
      aliasType: aliasType,
      alias: aliasText || aliasType,
      aliasAction: Constants.AliasAction[namespace.alias.type],
      parentName: namespace.registrationType !== 0 ? namespace.name.split('.')[0].toUpperCase() : '',
      levels: namespace.levels
    }
  }

}

export default NamespaceService
