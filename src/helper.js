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

import Vue from 'vue'

class helper {
  static timeSince(interval) {
    if (interval.years > 1) {
      return interval.years + ' years'
    } else if (interval.years === 1) {
      return interval.years + ' year'
    } else if (interval.days > 1) {
      return interval.days + ' days'
    } else if (interval.days === 1) {
      return interval.days + ' day'
    } else if (interval.hours > 1) {
      return interval.hours + ' hours'
    } else if (interval.hours === 1) {
      return interval.hours + ' hour'
    } else if (interval.minutes > 1) {
      return interval.minutes + ' min.'//' minutes'
    } else if (interval.minutes === 1) {
      return interval.minutes + ' min.'//' minute'
    } else if (interval.seconds !== 1) {
      return interval.seconds + ' sec.'//' seconds'
    } else {
      return interval.seconds + ' sec.'//' second'
    }
  }

  static daysToVest(balance, initialVested, targetVested) {
    /** Algorithm:
     *    Our goal is to calculate the number of days it takes to vest
     *    a balance to reach out target vested balance.
     *
     *  Parameters:
     *    Vesting Rate `R` (for XEM, 0.1).
     *    Account Balance `B` ("balance").
     *    Initial Vested Amount `V(0)` ("vested").
     *    Days `D`
     *
     *  Formula:
     *    To calculate the vested balance at day `D`, `V(D)` is:
     *      V(D) = B - ( (1-R)^D * (B - V(0)) )
     *
     *    Solving for `D`, we get:
     *      D = log(B - V(D), 1-R) - log(B - V(0), 1-R)
     */
    const r = 0.1
    const d = Math.log(1 - r)
    const lhs = Math.log(balance - targetVested) / d
    const rhs = Math.log(balance - initialVested) / d

    return Math.ceil(lhs - rhs)
  }

  static isHexadecimal(str) {
    let regexp = /^[0-9a-fA-F]+$/

    if (regexp.test(str)) {
      return true
    } else {
      return false
    }
  }

  static validURL(_str) {
    if (typeof _str === 'string') {
      let str = _str.replace('ws', 'http')
      let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      return !!pattern.test(str)
    }
  }

  static formatUrl(rawUrl) {
    if (this.validURL(rawUrl)) {
      let url = new URL(rawUrl)
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        url: rawUrl
      }
    }
  }

  static httpToWsUrl(url) {
    if (this.validURL(url)) {
      return url.replace('http', 'ws')
    }
  }

  static async logError(dispatch, action, ...args) {
    try {
      await dispatch(action, ...args)
    } catch (e) {
      console.error(`Failed to call ${action}`, e)
    }
  }
}

export default helper
