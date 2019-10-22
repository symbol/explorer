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
  MosaicService,
  Address,
  AccountHttp,
  MosaicHttp,
  NetworkHttp
} from 'nem2-sdk'

import helper from '../helper'
import format from '../format'
import dto from './dto'

let ACCOUNT_HTTP
let MOSAIC_HTTP
let NAMESPACE_HTTP
let NETWORK_HTTP


class sdkMosaic {
  static init = async nodeUrl => {
    ACCOUNT_HTTP = new AccountHttp(nodeUrl)
    MOSAIC_HTTP = new MosaicHttp(nodeUrl)
    NAMESPACE_HTTP = new NamespaceHttp(nodeUrl)
    NETWORK_HTTP = new NetworkHttp(nodeUrl)
  }

  static getMosaicsAmountByAddress = async address => {
    const mosaicService = new MosaicService(
      ACCOUNT_HTTP,
      MOSAIC_HTTP
    )
    const mosaicAmount = await mosaicService
      .mosaicsAmountViewFromAddress(new Address(address))
      .toPromise()

    return mosaicAmount
  }

// TODO(ahuszagh) Remove...
//  static getMosaicInfo = async mosaicHexOrNamespace => {
//
//    let mosaicID = ''
//
//    if (helper.isHexadecimal(mosaicHexOrNamespace)) {
//      mosaicID = new MosaicId(mosaicHexOrNamespace);
//    } else {
//      let namespaceId = new NamespaceId(mosaicHexOrNamespace)
//      mosaicID = await NAMESPACE_HTTP.getLinkedMosaicId(namespaceId).toPromise()
//    }
//    // const mosaicInfo = await MOSAIC_HTTP.getMosaic(mosaicID).toPromise(); // SDK Break
//    const mosaicName = await MOSAIC_HTTP.getMosaicsNames([mosaicID]).toPromise();
//
//    return format.formatMosaicInfo(mosaicInfo,mosaicName[0])
//  }

  static getMosaicsFromIdWithLimit = async (limit, fromMosaicId) => {
    let mosaicId
    if (fromMosaicId === undefined) {
      mosaicId = 'latest'
    } else {
      mosaicId = fromMosaicId
    }

    // Make request.
    const networkType = await NETWORK_HTTP.getNetworkType().toPromise()
    const path = `/mosaics/from/${mosaicId}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, networkType))

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
    const networkType = await NETWORK_HTTP.getNetworkType().toPromise()
    const path = `/mosaics/since/${mosaicId}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, networkType))

    return format.formatMosaicInfos(mosaics)
  }
}

export default sdkMosaic
