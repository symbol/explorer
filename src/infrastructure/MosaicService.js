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

class MosaicService {
  /**
   * Gets MosaicInfo for different mosaicIds.
   * @param mosaicIds[] - Array of mosaic ids
   * @returns Formatted MosaicInfo[]
   */
   static getMosaics = async mosaicIds => {
     const mosaics = await http.mosaic.getMosaics(mosaicIds).toPromise()
     const formattedMosaics = mosaics.map(mosaic => this.formatMosaicInfo(mosaic))

     return formattedMosaics
   }

   /**
   * Gets the MosaicInfo for a given mosaicId
   * @param mosaicId -  Mosaic id
   * @returns Formatted MosaicInfo
   */
   static getMosaic = async mosaicId => {
     const mosaic = await http.mosaic.getMosaic(mosaicId).toPromise()
     const formattedMosaic = this.formatMosaicInfo(mosaic)

     return formattedMosaic
   }

   /**
    * Get formatted MosaicInfo dataset into Vue Component
    * @param hexOrNamespace - hex value or namespace name
    * @returns MosaicInfo info object
    */
   static getMosaicInfo = async (hexOrNamespace) => {
     const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic')
     const mosaicInfo = await this.getMosaic(mosaicId)

     // Todo attach get mosaic name
     return mosaicInfo
   }

   /**
    * Format MosaicInfo to readable mosaicInfo object
    * @param MosaicInfoDTO
    * @returns Object readable MosaicInfoDTO object
    */
   static formatMosaicInfo = mosaicInfo => ({
     mosaicId: mosaicInfo.id.toHex(),
     divisibility: mosaicInfo.divisibility,
     address: mosaicInfo.owner.address.plain(),
     supply: mosaicInfo.supply.compact().toLocaleString('en-US'),
     relativeAmount: helper.formatMosaicAmountWithDivisibility(mosaicInfo.supply, mosaicInfo.divisibility),
     revision: mosaicInfo.revision,
     startHeight: mosaicInfo.height.compact(),
     duration: mosaicInfo.duration.compact(),
     supplyMutable: mosaicInfo.flags.supplyMutable,
     transferable: mosaicInfo.flags.transferable,
     restrictable: mosaicInfo.flags.restrictable
   })
}

export default MosaicService
