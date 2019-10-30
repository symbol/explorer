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
  Address
} from 'nem2-sdk'

import dto from './dto'
import http from './http'
import format from '../format'

class sdkMosaic {
  static getMosaicsAmountByAddress = async address => {
    const mosaicAmount = await http.mosaicService
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
  //    // const mosaicInfo = await http.mosaic.getMosaic(mosaicID).toPromise(); // SDK Break
  //    const mosaicName = await http.mosaic.getMosaicsNames([mosaicID]).toPromise();
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
    const networkType = await http.network.getNetworkType().toPromise()
    const path = `/mosaics/from/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
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
    const networkType = await http.network.getNetworkType().toPromise()
    const path = `/mosaics/since/${mosaicId}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const mosaics = response.data.map(info => dto.createMosaicInfoFromDTO(info, networkType))

    return format.formatMosaicInfos(mosaics)
  }
}

export default sdkMosaic
