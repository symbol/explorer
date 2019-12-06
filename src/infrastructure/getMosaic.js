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
import {
  Address,
  MosaicId,
  NamespaceId,
} from 'nem2-sdk'

import dto from './dto'
import http from './http'
import format from '../format'
import helper from '../helper'
import sdkMetadata from '../infrastructure/getMetadata'

class sdkMosaic {
  static getMosaicsAmountByAddress = async address => {
    const mosaicAmount = await http.mosaicService
      .mosaicsAmountViewFromAddress(new Address(address))
      .toPromise()

    return mosaicAmount
  }

  static getMosaicInfo = async mosaicHexOrNamespace => {
    let mosaicID

    if (helper.isHexadecimal(mosaicHexOrNamespace)) {
      mosaicID = new MosaicId(mosaicHexOrNamespace)
    } else {
      let namespaceId = new NamespaceId(mosaicHexOrNamespace)
      mosaicID = await http.namespace.getLinkedMosaicId(namespaceId).toPromise()
    }
    const mosaicInfo = await http.mosaic.getMosaic(mosaicID).toPromise()

    await this.addMosaicAliasNames([mosaicInfo])

    return format.formatMosaicInfo(mosaicInfo)
  }

  static getMosaicsFromIdWithLimit = async (limit, fromMosaicId) => {
    let mosaicId
    if (fromMosaicId === undefined) {
      mosaicId = 'latest'
    } else {
      mosaicId = fromMosaicId
    }

    // Make request.
    const path = `/mosaics/from/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, http.networkType))

    await this.addMosaicAliasNames(mosaics)

    return format.formatMosaicInfos(mosaics)
  }

  static getMosaicsSinceIdWithLimit = async (limit, sinceMosaicId) => {
    let mosaicId
    if (sinceMosaicId === undefined) {
      mosaicId = 'earliest'
    } else {
      mosaicId = sinceMosaicId
    }

    // Make request.
    const path = `/mosaics/since/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, http.networkType))

    await this.addMosaicAliasNames(mosaics)

    return format.formatMosaicInfos(mosaics)
  }

  static getMosaicInfoFormatted = async mosaicHexOrNamespace => {
    let mosaicInfo
    let metadataList
    let mosaicInfoFormatted

    try { mosaicInfo = await sdkMosaic.getMosaicInfo(mosaicHexOrNamespace) } catch (e) { throw Error('Failed to fetch mosaic info', e) }

    try { metadataList = await sdkMetadata.getMosaicMetadata(mosaicHexOrNamespace) } catch (e) { console.warn(e) }

    if (mosaicInfo) {
      mosaicInfoFormatted = {
        mosaicId: mosaicInfo.mosaic,
        mosaicAliasName: mosaicInfo.mosaicAliasName,
        namespace: mosaicInfo.namespace,
        divisibility: mosaicInfo.divisibility,
        owneraddress: mosaicInfo.address,
        supply: mosaicInfo.supply,
        relativeAmount: mosaicInfo.relativeAmount,
        revision: mosaicInfo.revision,
        startHeight: mosaicInfo.startHeight,
        duration: mosaicInfo.duration,
        supplyMutable: mosaicInfo.supplyMutable,
        transferable: mosaicInfo.transferable,
        restrictable: mosaicInfo.restrictable
      }
    }
    return {
      mosaicInfo: mosaicInfoFormatted || {},
      metadataList: metadataList || []
    }
  }

  static addMosaicAliasNames = async mosaics => {

    // Fetch the mosaic name objects from the IDs.
    const mosaicIdsList = mosaics.map(mosaicInfo => mosaicInfo.id)
    const mosaicNames = await http.namespace.getMosaicsNames(mosaicIdsList).toPromise()

    // Create a mapping of mosaics IDs to names.
    const idToNameMap = {}
    for (let item of mosaicNames) {
      idToNameMap[item.mosaicId.toHex()] = item.names
    }

    // Add name to mosaics object.
     mosaics.map(info => {
       info.mosaicAliasName = idToNameMap[info.id.toHex()]
    })

    return mosaics
  }
}

export default sdkMosaic
