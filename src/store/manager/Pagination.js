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
import Constants from '../../config/constants'

export default class Timeline {
  constructor({ name, fetchFunction, pageInfo, filter }) {
    if (typeof name !== 'string')
      throw Error('Failed to construct Timeline. Name is not provided')
    if (typeof fetchFunction !== 'function')
      throw Error('Cannot create timeline. Fetch function is not provided')

    this.name = name
    this.fetchFunction = fetchFunction
    this.pageInfo = pageInfo
    if (filter !== null && typeof filter === 'object') {
      this.options = filter
      this.filterValue = Object.keys(this.options).find(key => key === 'all')
    } else
      this.options = []

    this.store = {}

    this.addLatestItem = this.addLatestItem.bind(this)
    this.initialized = false
    this.loading = false
    this.error = false
  }

  static empty() {
    return {
      data: [],
      canFetchNext: false,
      canFetchPrevious: false,
      fetchNext: () => { },
      fetchPrevious: () => { },
      reset: () => { }
    }
  }

  get data() {
    return this?.pageInfo?.data || []
  }

  get index() {
    return (
            this?.pageInfo?.pageNumber
              ? this.pageInfo.pageNumber
              : void 0
    ) || 1
  }

  get lastPage() {
    return (
            this?.pageInfo?.totalPages
              ? this.pageInfo.totalPages
              : void 0
    ) || '..'
  }

  get pageSize() {
    return this?.pageInfo?.pageSize || Constants.pageSize
  }

  get filterOptions() {
    return this.options
  }

  setStore(store) {
    this.store = store
    this.store.dispatch(this.name, this)
    return this
  }

  initialFetch() {
    if (!this.initialized) {
      this.initialized = true
      return this.fetch()
    }
  }

  uninitialize() {
    this.initialized = false
    this.pageInfo.pageNumber = 1
    if (this.options !== null && typeof this.options === 'object')
      this.filterValue = Object.keys(this.options)[0]
    this.loading = false
    this.error = false
  }

  async fetch() {
    this.loading = true
    this.store.dispatch(this.name, this)

    try {
      this.pageInfo = await this.fetchFunction(this.pageInfo, this.filterValue, this.store)
    } catch (e) {
      console.error(e)
      this.error = true
    }
    this.loading = false

    this.store.dispatch(this.name, this)
    return this
  }

  get canFetchPrevious() {
    return this.pageInfo.pageNumber > 1 && this.loading === false
  }

  get canFetchNext() {
    return this.pageInfo.pageNumber < this.pageInfo.totalPages && this.loading === false
  }

  get isLive() {
    return this.index === 1
  }

  async fetchNext() {
    if (this.canFetchNext) {
      this.store.dispatch(this.name, this)
      this.pageInfo.pageNumber++
      await this.fetch()
    } else
      console.error('Timeline cannot fetch next')
    this.loading = false

    this.store.dispatch(this.name, this)
    return this
  }

  async fetchPrevious() {
    if (this.canFetchPrevious) {
      this.store.dispatch(this.name, this)
      this.pageInfo.pageNumber--
      await this.fetch()
    } else
      return this.reset()

    this.store.dispatch(this.name, this)
    return this
  }

  async fetchWithCriteria(pageInfo) {
    if (
      pageInfo !== null &&
            typeof pageInfo !== 'undefined'
    ) {
      this.store.dispatch(this.name, this)
      if (this.pageInfo === null || typeof this.pageInfo !== 'object') {
        for (const key in pageInfo)
          this.pageInfo[key] = pageInfo[key]
      }
      await this.fetch()
    } else
      console.error(`[Pagination]: failed to fetchWithCriteria 'pageInfo' is not an object`)

    this.store.dispatch(this.name, this)
    return this
  }

  async changeFilterValue(filterValue) {
    this.uninitialize()
    this.filterValue = filterValue
    await this.fetch()
    this.store.dispatch(this.name, this)
    return this
  }

  async reset(pageNumber = 1) {
    this.pageInfo.pageNumber = pageNumber
    if (this.options !== null && typeof this.options === 'object')
      this.filterValue = Object.keys(this.options)[0]
    return this.fetch()
  }

  // Add latest item to current.
  addLatestItem(item, keyName) {
    if (this.isLive) {
      if (this.data?.length && this.data[0][keyName] === item[keyName])
        console.error('internal error: attempted to add duplicate item to timeline.')
      else {
        const data = [item, ...this.data]
        data.pop()
        this.data = [].concat.apply([], data)
        this.store.dispatch(this.name, this)
        return this
      }
    }
  }
}
