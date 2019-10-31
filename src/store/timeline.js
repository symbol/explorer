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
import Constants from '../config/constants'

export default class Timeline {
  constructor(previous, current, next, index) {
    this.previous = previous
    this.current = current
    this.next = next
    this.index = index
  }

  static empty() {
    return new Timeline([], [], [], 0)
  }

  static fromData(data) {
    // Break data for the initial list into the current and next.
    const previous = []
    const current = data.slice(0, Constants.PageSize)
    const next = data.slice(Constants.PageSize, 2 * Constants.PageSize)
    const index = 0
    return new Timeline(previous, current, next, index)
  }

  get isLive() {
    return this.index === 0
  }

  get canFetchPrevious() {
    return this.previous.length !== 0
  }

  get canFetchNext() {
    return this.next.length !== 0
  }

  // Add latest item to current.
  addLatestItem(item, key) {
    if (!this.isLive) {
      throw new Error('internal error: attempted to addLatestItem for non-live timeline.')
    }
    if (this.current[0][key] === item[key]) {
      throw new Error('internal error: attempted to add duplicate item to timeline.')
    }

    const data = [item, ...this.current, ...this.next]
    return Timeline.fromData(data)
  }

  // Add data fetched from previous.
  async shiftPrevious(fetchPrevious, fetchLive) {
    if (this.index > 1) {
      // Fetch previous.
      let previous = []
      try { previous = await fetchPrevious(Constants.PageSize) } catch (e) { console.error(e) }

      return new Timeline(previous, this.previous, this.current, this.index - 1)
    } else {
      // Fetch live.
      let data = []
      try { data = await fetchLive(2 * Constants.PageSize) } catch (e) { console.error(e) }

      return Timeline.fromData(data)
    }
  }

  // Add data fetched from next.
  async shiftNext(fetchNext) {
    let next = []
    try { next = await fetchNext(Constants.PageSize) } catch (e) { console.error(e) }

    return new Timeline(this.current, this.next, next, this.index + 1)
  }

  // Prepend item to array.
  static prependItem(list, item) {
    if (list.length >= Constants.PageSize) {
      list.pop()
    }
    list.unshift(item)
  }
}
