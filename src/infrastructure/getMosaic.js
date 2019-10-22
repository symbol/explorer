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

import {
  MosaicService,
  Address,
  AccountHttp,
  MosaicHttp,
  NamespaceHttp,
  MosaicId,
  NamespaceId
} from 'nem2-sdk'
import { Endpoint } from '../config/'
import helper from '../helper'
import format from '../format'

let ACCOUNT_HTTP
let MOSAIC_HTTP
let NAMESPACE_HTTP

class sdkMosaic {
  static connect = async nodeUrl => {
    ACCOUNT_HTTP = new AccountHttp(nodeUrl)
    MOSAIC_HTTP = new MosaicHttp(nodeUrl)
    NAMESPACE_HTTP = new NamespaceHttp(nodeUrl)
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

  static getMosaicInfo = async mosaicHexOrNamespace => {
    let mosaicID = ''

    if (helper.isHexadecimal(mosaicHexOrNamespace)) {
      mosaicID = new MosaicId(mosaicHexOrNamespace)
    } else {
      let namespaceId = new NamespaceId(mosaicHexOrNamespace)
      mosaicID = await NAMESPACE_HTTP.getLinkedMosaicId(namespaceId).toPromise()
    }
    const mosaicInfo = await MOSAIC_HTTP.getMosaic(mosaicID).toPromise()
    const mosaicName = await MOSAIC_HTTP.getMosaicsNames([mosaicID]).toPromise()

    return format.formatMosaicInfo(mosaicInfo, mosaicName[0])
  }
}

export default sdkMosaic
