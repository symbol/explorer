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
  MosaicId,
  NamespaceId
} from 'nem2-sdk'

import dto from './dto'
import http from './http'
import format from '../format'
import helper from '../helper'
import sdkMetadata from '../infrastructure/getMetadata'
import { getMosaicRestrictions } from '../infrastructure/getRestriction'

class sdkMosaic {
  static getMosaicInfo = async mosaicHexOrNamespace => {
    let mosaicID

    if (helper.isHexadecimal(mosaicHexOrNamespace))
      mosaicID = new MosaicId(mosaicHexOrNamespace)
    else {
      let namespaceId = new NamespaceId(mosaicHexOrNamespace)
      mosaicID = await http.namespace.getLinkedMosaicId(namespaceId).toPromise()
    }

    const mosaicInfoAliasNames = await sdkMosaic.getMosaicInfoAliasNames([mosaicID])

    return format.formatMosaicInfo(mosaicInfoAliasNames[0])
  }

  static getMosaicsFromIdWithLimit = async (limit, fromMosaicId) => {
    let mosaicId
    if (fromMosaicId === undefined)
      mosaicId = 'latest'
    else
      mosaicId = fromMosaicId

    // Make request.
    const path = `/mosaics/from/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, http.networkType))

    const mosaicIdsList = mosaics.map(mosaicInfo => mosaicInfo.id)
    const mosaicInfoAliasNames = await sdkMosaic.getMosaicInfoAliasNames(mosaicIdsList)

    return mosaicInfoAliasNames.map(mosaicInfoAliasName => format.formatMosaicInfo(mosaicInfoAliasName))
  }

  static getMosaicsSinceIdWithLimit = async (limit, sinceMosaicId) => {
    let mosaicId
    if (sinceMosaicId === undefined)
      mosaicId = 'earliest'
    else
      mosaicId = sinceMosaicId

    // Make request.
    const path = `/mosaics/since/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, http.networkType))

    const mosaicIdsList = mosaics.map(mosaicInfo => mosaicInfo.id)
    const mosaicInfoAliasNames = await sdkMosaic.getMosaicInfoAliasNames(mosaicIdsList)

    return mosaicInfoAliasNames.map(mosaicInfoAliasName => format.formatMosaicInfo(mosaicInfoAliasName))
  }

  static getMosaicInfoFormatted = async mosaicHexOrNamespace => {
    let mosaicInfo
    let metadataList
    let mosaicInfoFormatted
    let mosaicRestriction
    let mosaicRestrictionInfo
    let mosaicRestrictionList

    try { mosaicInfo = await sdkMosaic.getMosaicInfo(mosaicHexOrNamespace) } catch (e) { throw Error('Failed to fetch mosaic info', e) }

    try { metadataList = await sdkMetadata.getMosaicMetadata(mosaicHexOrNamespace) } catch (e) { console.warn(e) }

    try { mosaicRestriction = await getMosaicRestrictions(mosaicHexOrNamespace) } catch (e) { console.warn(e) }

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

    if (mosaicRestriction) {
      mosaicRestrictionInfo = {
        entryType: mosaicRestriction.entryType,
        mosaicId: mosaicRestriction.mosaicId
      }

      mosaicRestrictionList = mosaicRestriction.restrictions
    }
    return {
      mosaicInfo: mosaicInfoFormatted || {},
      metadataList: metadataList || [],
      mosaicRestrictionInfo: mosaicRestrictionInfo || {},
      mosaicRestrictionList: mosaicRestrictionList || []
    }
  }

  static getMosaicInfoAliasNames = async mosaicIds => {
    const mosaicIdsList = mosaicIds.map(mosaicInfo => mosaicInfo.id)
    const mosaicInfos = await http.mosaic.getMosaics(mosaicIdsList).toPromise()
    const mosaicNames = await http.namespace.getMosaicsNames(mosaicIdsList).toPromise()

    return mosaicIdsList.map(mosaicId => ({
      id: new MosaicId(mosaicId.toHex()),
      mosaicInfo: mosaicInfos.find(info => info.id.id.equals(mosaicId)),
      mosaicName: mosaicNames.find(name => name.mosaicId.id.equals(mosaicId))
    }))
  }
}

export default sdkMosaic
