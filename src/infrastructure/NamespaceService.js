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
import moment from 'moment'
import { DataService, ChainService } from '../infrastructure'

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
   * Get readable names for a set of mosaics Returns friendly names for mosaics.
   * @param mosaicIds - Array of mosaic ids
   * @returns MosaicNames[]
   */
  static getMosaicsNames = async (mosaicIds) => {
    const mosaicNames = await http.namespace.getMosaicsNames(mosaicIds).toPromise()
    const formattedMosaicNames = mosaicNames.map(mosaicName => this.formatMosaicName(mosaicName))

    return formattedMosaicNames
  }

  /**
   * Returns friendly names for array of addresses.
   * @param addresses - Array of addresses
   * @returns AccountNames[]
   */
  static getAccountsNames = async (addresses) => {
    const accountNames = await http.namespace.getAccountsNames(addresses).toPromise()
    const formattedAccountNames = accountNames.map(accountName => this.formatAccountName(accountName))

    return formattedAccountNames
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
    const currentHeight = await ChainService.getBlockchainHeight()
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
  static getNamespaceLevelList = async (hexOrNamespace) => {
    let namespaceId = await helper.hexOrNamespaceToId(hexOrNamespace, 'namespace')
    let namespacesName = await this.getNamespacesName([namespaceId])

    return namespacesName
  }

  /**
   * Get custom NamespaceInfo dataset into Vue Component
   * @param limit — No of namespaceInfo
   * @param fromNamespaceId — (Optional) retrive next namespace in pagination
   * @returns custom NamespaceInfo[]
   */
  static getNamespaceList = async (limit, fromNamespaceId) => {
    const namespaceInfos = await DataService.getNamespacesFromIdWithLimit(limit, fromNamespaceId)

    const namespaceIdsList = namespaceInfos.map(namespacesInfo => namespacesInfo.id)
    const namespaceNames = await this.getNamespacesName(namespaceIdsList)

    const namespaces = namespaceInfos.map(namespaceInfo => ({
      ...namespaceInfo,
      id: namespaceInfo.id,
      name: this.extractFullNamespace(namespaceInfo, namespaceNames)
    }))

    const formattedNamespaces = namespaces.map(namespace => this.formatNamespace(namespace))

    const currentHeight = await ChainService.getBlockchainHeight()

    return formattedNamespaces.map(formattedNamespace => {
      const { isExpired, expiredInSecond, expiredInBlock } = helper.calculateNamespaceExpiration(currentHeight, formattedNamespace.endHeight)

      return {
        ...formattedNamespace,
        owneraddress: formattedNamespace.owner,
        duration: moment.utc().add(expiredInSecond, 's').fromNow() || Constants.Message.UNLIMITED,
        isExpired: isExpired,
        approximateExpired: moment.utc().add(expiredInSecond, 's').local().format('YYYY-MM-DD HH:mm:ss'),
        expiredInBlock: expiredInBlock
      }
    })
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
   * @param namespace - namespace DTO
   * @returns readable namespaceDTO
   */
  static formatNamespace = namespace => {
    let aliasText
    let aliasType
    switch (namespace.alias.type) {
    case 1:
      aliasText = namespace.alias.mosaicId
      aliasType = Constants.Message.MOSAIC
      break
    case 2:
      aliasText = namespace.alias.address
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
      namespaceId: namespace.id.toHex(),
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

  /**
   * Format mosaic name to readable object
   * @param mosaicName - mosaicName DTO
   * @returns readable mosaicName DTO
   */
  static formatMosaicName = mosaicName => ({
    ...mosaicName,
    mosaicId: mosaicName.mosaicId.toHex()
  })

  /**
   * Format account name to readable object
   * @param accountName - accountName DTO
   * @returns readable accountName DTO
   */
  static formatAccountName = accountName => ({
    ...accountName,
    address: accountName.address.plain(),
    names: accountName.names.map(name => this.formatNamespaceName(name))
  })

  /**
   * Extract full name for Namespace
   * @param namespaceInfo - namespaceInfo DTO
   * @param namespaceNames - NamespaceName[]
   * @returns full name
   */
  static extractFullNamespace = (namespaceInfo, namespaceNames) => {
    return namespaceInfo.levels.map((level) => {
      const namespaceName = namespaceNames.find((name) => name.namespaceId === level.toHex())

      if (namespaceName === undefined) throw new Error('Not found')
      return namespaceName
    })
      .map((namespaceName) => namespaceName.name)
      .join('.')
  }
}

export default NamespaceService
