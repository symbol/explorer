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

import { MosaicService, Address, AccountHttp, MosaicHttp, NamespaceHttp, MosaicId, NamespaceId} from 'nem2-sdk'
import { Endpoint } from '../config/'
import helper from '../helper'

const ACCOUNT_HTTP = new AccountHttp(Endpoint.api)
const MOSAIC_HTTP = new MosaicHttp(Endpoint.api)
const NAMESPACE_HTTP = new NamespaceHttp(Endpoint.api)

class sdkMosaic {
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

  static getMosaicInfoByHex = async mosaicHexOrNamespace => {

    let getMosaicID = ''
    // if (!helper.isHexadecimal(mosaicHexOrNamespace)){
    //   getMosaicID = await NAMESPACE_HTTP.getLinkedMosaicId(a).toPromise()
    // }
    // const mosaic = new MosaicId(mosaicHex);
    const a = new NamespaceId(mosaicHexOrNamespace)
    // const mosaicInfo = await MOSAIC_HTTP.getMosaics([mosaic]).toPromise(); // SDK Break
    // const mosaicName = await MOSAIC_HTTP.getMosaicsNames([mosaic]).toPromise();
    getMosaicID = await NAMESPACE_HTTP.getLinkedMosaicId(a).toPromise()
    // console.log(mosaicInfo)
    // 77A1969932D987D7
    // console.log(getMosaicID.toHex())
    console.log(getMosaicID)

    return '123'

    // return utils.formatMosaicInfo(mosaicInfo[0]);
  }
}

export default sdkMosaic

