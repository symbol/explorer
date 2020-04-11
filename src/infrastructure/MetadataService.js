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
import { Address, QueryParams } from 'symbol-sdk'
import helper from '../helper'
import Constants from '../config/constants'

class MetadataService {
  /**
   * Get Account Metadata from symbol SDK
   * @param address - Account address to be created from PublicKey or RawAddress
   * @param pageSize - no. of data
   * @param id - (Optional) retrive next AccountMetadata in pagination
   * @returns Metadata[]
   */
  static getAccountMetadata = async (address, pageSize = 10, id = '') => {
    const metadatas = await http.metadata
      .getAccountMetadata(Address.createFromRawAddress(address), new QueryParams({ pageSize, id }))
      .toPromise()

    return metadatas.map(metadata => this.formatMetadata(metadata))
  }

  /**
   * Get Mosaic Metadata from symbol SDK
   * @param mosaicId - Mosaic identifier
   * @param pageSize - no. of data
   * @param id - (Optional) retrive next MosaicMetadata in pagination
   * @returns Metadata[]
   */
  static getMosaicMetadata = async (mosaicId, pageSize = 10, id = '') => {
    const metadatas = await http.metadata
      .getMosaicMetadata(mosaicId, new QueryParams({ pageSize, id }))
      .toPromise()

    return metadatas.map(metadata => this.formatMetadata(metadata))
  }

  /**
   * Get Namespace Metadata from symbol SDK
   * @param namespaceId - Namespace identifier
   * @param pageSize - no. of data
   * @param id - (Optional) retrive next NamespaceMetadata in pagination
   * @returns Metadata[]
   */
  static getNamespaceMetadata = async (namespaceId, pageSize = 10, id = '') => {
    const metadatas = await http.metadata
      .getNamespaceMetadata(namespaceId, new QueryParams({ pageSize, id }))
      .toPromise()

    return metadatas.map(metadata => this.formatMetadata(metadata))
  }

  /**
   * Format Metadata to readable object
   * @param metadata - metadata DTO
   * @returns readable Metadata object
   */
  static formatMetadata = metadata => ({
    metadataId: metadata.id,
    ...this.formatMetadataEntry(metadata.metadataEntry)
  })

  /**
   * Format MetadataEntry to readable object
   * @param metadataEntry - metadataEntry DTO
   * @returns readable metadataEntry object
   */
  static formatMetadataEntry = metadataEntry => ({
    ...metadataEntry,
    scopedMetadataKey: metadataEntry.scopedMetadataKey.toHex(),
    senderAddress: helper.publicKeyToAddress(metadataEntry.senderPublicKey),
    targetAddress: helper.publicKeyToAddress(metadataEntry.targetPublicKey),
    metadataType: Constants.MetadataType[metadataEntry.metadataType],
    targetId: metadataEntry.targetId ? metadataEntry.targetId.toHex() : Constants.Message.UNAVAILABLE,
    metadataValue: metadataEntry.value
  })

  /**
   * Format Account Metadata list dataset into Vue component
   * @param rawAddress - Address in string format.
   * @returns Account Metadata list
   */
  static getAccountMetadataList = async (rawAddress, pageSize, id) => {
    const accountMetadatas = await this.getAccountMetadata(rawAddress, pageSize, id)
    return accountMetadatas
  }

  /**
   * Format Mosaic Metadata list dataset into Vue component.
   * @param hexOrNamespace - hex value or namespace name
   * @returns Mosaic Metadata list
   */
  static getMosaicMetadataList = async (hexOrNamespace, pageSize, id) => {
    const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic')
    const mosaicMetadata = await this.getMosaicMetadata(mosaicId, pageSize, id)
    return mosaicMetadata
  }

  /**
   * Format Namespace Metadata list dataset into Vue component.
   * @param hexOrNamespace - hex value or namespace name
   * @returns Namespace Metadata list
   */
  static getNamespaceMetadataList = async (hexOrNamespace, pageSize, id) => {
    const namespaceId = await helper.hexOrNamespaceToId(hexOrNamespace, 'namespace')
    const namespaceMetadata = await this.getNamespaceMetadata(namespaceId, pageSize, id)
    return namespaceMetadata
  }
}

export default MetadataService
