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
      return interval.minutes + ' minutes'
    } else if (interval.minutes === 1) {
      return interval.minutes + ' minute'
    } else if (interval.seconds !== 1) {
      return interval.seconds + ' seconds'
    } else {
      return interval.seconds + ' second'
    }
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
}
export default helper
