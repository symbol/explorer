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

import Timeline from './timeline'
import sdkMosaic from '../infrastructure/getMosaic'

export default {
  namespaced: true,
  state: {
    // Timeline of data current in the view.
    timeline: Timeline.empty(),
    // Determine if the mosaics model is loading.
    loading: false,
    // The Mosaic detail information.
    mosaicInfo: {}
  },
  getters: {
    getTimeline: state => state.timeline,
    getCanFetchPrevious: state => state.timeline.canFetchPrevious,
    getCanFetchNext: state => state.timeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      mosaicId: el.mosaic,
      owneraddress: el.address,
      supply: el.supply,
      divisibility: el.divisibility,
      startHeight: el.startHeight
    })),
    getLoading: state => state.loading,
    getMosaicInfo: state => state.mosaicInfo
  },
  mutations: {
    setTimeline: (state, timeline) => { state.timeline = timeline },
    setLoading: (state, loading) => { state.loading = loading },
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
    initializeSdk({ rootGetters }) {
      sdkMosaic.init(rootGetters['api/currentNode'].url)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      let mosaicList = await sdkMosaic.getMosaicsFromIdWithLimit(2 * Timeline.pageSize)
      commit('setTimeline', Timeline.fromData(mosaicList))
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.next
      if (list.length === 0) {
        throw new Error('internal error: next list is 0.')
      }
      const mosaic = list[list.length - 1]
      const fetchNext = pageSize => sdkMosaic.getMosaicsFromIdWithLimit(pageSize, mosaic.id)
      commit('setTimeline', await timeline.shiftNext(fetchNext))
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.previous
      if (list.length === 0) {
        throw new Error('internal error: previous list is 0.')
      }
      const mosaic = list[0]
      const fetchPrevious = pageSize => sdkMosaic.getMosaicsSinceIdWithLimit(pageSize, mosaic.id)
      const fetchLive = pageSize => sdkMosaic.getMosaicsSinceIdWithLimit(pageSize)
      commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      commit('setLoading', false)
    },

    // Reset the mosaic page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      if (getters.getTimeline.index > 0) {
        const data = await sdkMosaic.getMosaicsFromIdWithLimit(2 * Timeline.pageSize)
        commit('setTimeline', Timeline.fromData(data))
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
