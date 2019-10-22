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

import util from './util'
import sdkMosaic from '../infrastructure/getMosaic'

export default {
  namespaced: true,
  state: {
    // Holds the PAGE_SIZE mosaics starting from current page.
    pageList: [],
    // The current page index (0-indexed).
    pageIndex: 0,
    // Determine if the mosaics model is loading.
    loading: false,
    // The Mosaic detail information.
    mosaicInfo: {}
  },
  getters: {
    getPageList: state => state.pageList,
    getPageIndex: state => state.pageIndex,
    getLoading: state => state.loading,
    getPageListFormatted: (state, getters) => getters.getPageList.map(el => ({
      mosaicId: el.mosaic,
      owneraddress: el.address,
      supply: el.supply,
      divisibility: el.divisibility,
      startHeight: el.startHeight
    })),
    getMosaicInfo: state => state.mosaicInfo
  },
  mutations: {
    setPageList: (state, list) => { state.pageList = list },
    setPageIndex: (state, pageIndex) => { state.pageIndex = pageIndex },
    setLoading: (state, loading) => { state.loading = loading },
    resetPageIndex: (state) => { state.pageIndex = 0 },
    setMosaicInfo: (state, mosaicInfo) => { state.mosaicInfo = mosaicInfo }
  },
  actions: {

    // Initialize the mosaic model.
    // First fetch the page, then subscribe.
    async initialize({ dispatch }) {
      dispatch('initializeSdk')
      await dispatch('initializePage')
    },
      
      // Set node url to SDK
    initializeSdk({rootGetters}) {
      sdkMosaic.init(rootGetters['api/currentNode'].url)
    }

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      let mosaicList = await sdkMosaic.getMosaicsFromIdWithLimit(util.PAGE_SIZE)
      commit('setPageList', mosaicList)
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageList.length > 0) {
        // Page is loaded, need to fetch next page.
        const mosaic = pageList[pageList.length - 1]
        let mosaicList = await sdkMosaic.getMosaicsFromIdWithLimit(util.PAGE_SIZE, mosaic.id)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', mosaicList)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageList.length > 0) {
        // Page is loaded, need to fetch previous page.
        const mosaic = pageList[0]
        let mosaicList = await sdkMosaic.getMosaicsSinceIdWithLimit(util.PAGE_SIZE, mosaic.id)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', mosaicList)
      }
      commit('setLoading', false)
    },

    // Reset the mosaic page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      const pageIndex = getters.getPageIndex
      if (pageIndex > 0) {
        let mosaicList = await sdkMosaic.getMosaicsFromIdWithLimit(util.PAGE_SIZE)
        commit('setPageIndex', 0)
        commit('setPageList', mosaicList)
      }
      commit('setLoading', false)
    },

    // Fetch data from the SDK.
    async fetchMosaicInfo({ commit }, mosaicHexOrNamespace) {
      let mosaicInfo = await sdkMosaic.getMosaicInfo(mosaicHexOrNamespace)

      let mosaicInfoObject = {
        mosaicId: mosaicInfo.mosaic,
        namespace: mosaicInfo.namespace,
        divisibility: mosaicInfo.divisibility,
        owneraddress: mosaicInfo.address,
        supply: mosaicInfo.supply,
        revision: mosaicInfo.revision,
        startHeight: mosaicInfo.startHeight,
        duration: mosaicInfo.duration,
        supplyMutable: mosaicInfo.supplyMutable,
        transferable: mosaicInfo.transferable,
        restrictable: mosaicInfo.restrictable
      }
      commit('setMosaicInfo', mosaicInfoObject)
    }
  }
}
