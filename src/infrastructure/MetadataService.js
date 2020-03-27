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
import { Address } from 'symbol-sdk'
import helper from '../helper'
import Constants from '../config/constants'

class MetadataService {
  /**
   * Get Account Metadata from symbol SDK
   * @param address - Account address to be created from PublicKey or RawAddress
   * @returns Metadata[]
   */
  static getAccountMetadata = async address => {
    const metadatas = await http.metadata
      .getAccountMetadata(address)
      .toPromise()

    const formattedAccountMetadata = metadatas.map(metadata => this.formatMetadata(metadata))
    return formattedAccountMetadata
  }

  /**
   * Get Mosaic Metadata from symbol SDK
   * @param mosaicId - Mosaic identifier
   * @returns Metadata[]
   */
  static getMosaicMetadata = async mosaicId => {
    const metadatas = await http.metadata
      .getMosaicMetadata(mosaicId)
      .toPromise()

    const formattedMosaicMetadata = metadatas.map(metadata => this.formatMetadata(metadata))
    return formattedMosaicMetadata
  }

  /**
   * Get Namespace Metadata from symbol SDK
   * @param namespaceId - Namespace identifier
   * @returns Metadata[]
   */
  static getNamespaceMetadata = async namespaceId => {
    const metadatas = await http.metadata
      .getNamespaceMetadata(namespaceId)
      .toPromise()

    const formattedNamespaceMetadata = metadatas.map(metadata => this.formatMetadata(metadata))
    return formattedNamespaceMetadata
  }

  /**
   * Format Metadata to readable NodoInfo object
   * @param MetadataDTO
   * @returns Object readable MetadataDTO object
   */
  static formatMetadata = metadata => ({
    metadataId: metadata.id,
    compositeHash: metadata.metadataEntry.compositeHash,
    scopedMetadataKey: metadata.metadataEntry.scopedMetadataKey.toHex(),
    senderAddress: Address.createFromPublicKey(metadata.metadataEntry.senderPublicKey, http.networkType).plain(),
    targetAddress: Address.createFromPublicKey(metadata.metadataEntry.targetPublicKey, http.networkType).plain(),
    metadataType: Constants.MetadataType[metadata.metadataEntry.metadataType],
    targetId: metadata.metadataEntry.targetId ? metadata.metadataEntry.targetId.toHex() : Constants.Message.UNAVAILABLE,
    metadataValue: metadata.metadataEntry.value
  })

  /**
   * Format Account Metadata list dataset into Vue component
   * @param rawAddress - Address in string format.
   * @returns Account Metadata list
   */
  static getAccountMetadataList = async (rawAddress) => {
    const address = Address.createFromRawAddress(rawAddress)
    const accountMetadata = await this.getAccountMetadata(address)

    return accountMetadata
  }

  /**
   * Format Mosaic Metadata list dataset into Vue component.
   * @param hexOrNamespace - hex value or namespace name
   * @returns Mosaic Metadata list
   */
  static getMosaicMetadataList = async (hexOrNamespace) => {
    const mosaicId = this.convertor(hexOrNamespace, 'mosaic')
    const mosaicMetadata = await this.getMosaicMetadata(mosaicId)
    return mosaicMetadata
  }

  /**
   * Format Namespace Metadata list dataset into Vue component.
   * @param hexOrNamespace - hex value or namespace name
   * @returns Namespace Metadata list
   */
  static getNamespaceMetadataList = async (hexOrNamespace) => {
    const namespaceId = helper.hexOrNamespaceToId(hexOrNamespace, 'namespace')
    const namespaceMetadata = await this.getNamespaceMetadata(namespaceId)
    return namespaceMetadata
  }
}

export default MetadataService
