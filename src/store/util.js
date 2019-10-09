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

export default {
  // Number of elements in a page (should likely be toggle-able).
  PAGE_SIZE: 25,

  // ARRAY

  // Determine if an array includes a value by key.
  // Provide an optional max-index which allows us to restrict the
  // search to a smaller subset of the list (useful for data like
  // block lists).
  includes(list, item, key, maxIndex) {
    let length = Math.min(maxIndex || list.length, list.length)
    let itemKey = item[key]
    for (let i = 0; i < length; i++) {
      if (list[i][key] === itemKey) {
        return true
      }
    }
    return false
  },

  // Prepend item to array.
  prependItem(list, item) {
    if (list.length >= this.PAGE_SIZE) {
      list.pop()
    }
    list.unshift(item)
  },

  // GETTERS

  // Get the latest list from state.
  getLatestList(state) {
    return state.latestList
  },

  // Get the recent list from state.
  getRecentList(state) {
    return Array.prototype.filter.call(state.latestList, function (item, index) {
      return index < 4
    })
  },

  // Get the page list from state.
  getPageList(state) {
    return state.pageList
  },

  // Get the current page index from state.
  getPageIndex(state) {
    return state.pageIndex
  },

  // Get current websockets subscription from state.
  getSubscription(state) {
    return state.subscription
  },

  // Get if the data is loading.
  getLoading(state) {
    return state.loading
  },

  // MUTATIONS

  // Set the list of latest items to state.
  setLatestList(state, list) {
    state.latestList = list
  },

  // Set the list of page items to state.
  // If the page is 0, set the latest list to be the updated page.
  setPageList(state, list) {
    state.pageList = list
    if (state.pageIndex === 0) {
      state.latestList = [...state.pageList]
    }
  },

  // Set the current page index.
  setPageIndex(state, pageIndex) {
    state.pageIndex = pageIndex
  },

  // Set current websockets subscription to state.
  setSubscription(state, subscription) {
    state.subscription = subscription
  },

  // Set if the data is loading.
  setLoading(state, loading) {
    state.loading = loading
  },

  // Reset the current page index to 0.
  resetPageIndex(state) {
    state.pageIndex = 0
  },

  // Add latest item to the store.
  addLatestItemByKey(state, item, key, maxIndex) {
    // Add item to the latestList if the current key is not in the list. Assume the list is stored.
    if (!this.includes(state.latestList, item, key, maxIndex)) {
      this.prependItem(state.latestList, item)
      // Add the item to the pageList if we're on the first page **only**.
      if (state.pageIndex === 0) {
        this.prependItem(state.pageList, item)
      }
    }
  }
}
