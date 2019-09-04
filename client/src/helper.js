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

import { Address } from 'nem2-sdk'
class helper {
  static timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000)

    var interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + ' years'
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' months'
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' days'
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hours'
    }
    interval = Math.floor(seconds / 60)
    if (interval >= 1) {
      return interval + ' minutes'
    }
    return Math.floor(seconds) + ' seconds'
  }

  static uint64ToString(high, low) {
    let result = ''
    while (true) {
      let mod = (high % 10) * 0x100000000 + low
      high = Math.floor(high / 10)
      low = Math.floor(mod / 10)
      result = (mod % radix).toString(radix) + result
      if (!high && !low) {
        break
      }
    }
    result
  }

  static formatAccount(accountInfo) {
    let importanceScore = accountInfo.importance.compact()

    if (importanceScore) {
      importanceScore /= 90000
      importanceScore = importanceScore.toFixed(4).split('.')
      importanceScore = importanceScore[0] + '.' + importanceScore[1]
    }

    const accountObj = {
      meta: accountInfo.meta,
      address: new Address(accountInfo.address.address).pretty(),
      addressHeight: accountInfo.addressHeight.compact(),
      publicKey: accountInfo.publicKey,
      publicKeyHeight: accountInfo.publicKeyHeight.compact(),
      mosaics: this.formatMosaics(accountInfo.mosaics),
      importance: importanceScore,
      importanceHeight: accountInfo.importanceHeight.compact(),
    }

    return accountObj
  }

  static formatMosaics(mosaics) {
    mosaics.map(mosaic => {
      mosaic.hex = mosaic.id.toHex()
      mosaic.amount = mosaic.amount.compact()
    })
    return mosaics
  }
}
export default helper
