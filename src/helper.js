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

const Url = require('url-parse');

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

  static isHexadecimal(str) {
    return /^[0-9a-fA-F]+$/.test(str)
  }

  static validURL(url) {
    // All we expect is there is a valid origin for the url, IE,
    // the origin is not 'null'.
    return url.origin !== 'null'
  }

  static parseUrl(str) {
    let url = new Url(str)
    if (this.validURL(url)) {
      return url
    }
  }

  static httpToWsUrl(str) {
    let url = new Url(str)
    if (this.validURL(url)) {
      url.set('protocol', 'ws:')
      return url
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
