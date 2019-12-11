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

import Lock from './lock'
import Timeline from './timeline'
import Constants from '../config/constants'
import sdkMosaic from '../infrastructure/getMosaic'

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Timeline of data current in the view.
    timeline: Timeline.empty(),
    // Determine if the mosaics model is loading.
    loading: false,
    // Determine if the mosaics model has an error.
    error: false,
    // The Mosaic detail information.
    mosaicInfo: {},
    // The Mosaic Metadata list.
    metadataList: [],
    mosaicInfoLoading: false,
    mosaicInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getTimeline: state => state.timeline,
    getCanFetchPrevious: state => state.timeline.canFetchPrevious,
    getCanFetchNext: state => state.timeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      mosaicId: el.mosaic,
      mosaicAliasName: el.mosaicAliasName,
      owneraddress: el.address,
      supply: el.supply,
      divisibility: el.divisibility,
      relativeAmount:el.relativeAmount,
      startHeight: el.startHeight
    })),
    getLoading: state => state.loading,
    getError: state => state.error,
    getMosaicInfo: state => state.mosaicInfo,
    getMetadataList: state => state.metadataList,
    mosaicInfoLoading: state => state.mosaicInfoLoading,
    mosaicInfoError: state => state.mosaicInfoError
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setTimeline: (state, timeline) => { state.timeline = timeline },
    setLoading: (state, loading) => { state.loading = loading },
    setError: (state, error) => { state.error = error },
    setMosaicInfo: (state, mosaicInfo) => { state.mosaicInfo = mosaicInfo },
    setMetadataList: (state, metadataList) => { state.metadataList = metadataList },
    mosaicInfoLoading: (state, v) => { state.mosaicInfoLoading = v },
    mosaicInfoError: (state, v) => { state.mosaicInfoError = v }
  },
  actions: {
    // Initialize the mosaic model.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the mosaic model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {}
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      try {
        let mosaicList = await sdkMosaic.getMosaicsFromIdWithLimit(2 * Constants.PageSize)
        commit('setTimeline', Timeline.fromData(mosaicList))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.next
      try {
        if (list.length === 0) {
          throw new Error('internal error: next list is 0.')
        }
        const mosaic = list[list.length - 1]
        const fetchNext = pageSize => sdkMosaic.getMosaicsFromIdWithLimit(pageSize, mosaic.id)
        commit('setTimeline', await timeline.shiftNext(fetchNext))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.previous
      try {
        if (list.length === 0) {
          throw new Error('internal error: previous list is 0.')
        }
        const mosaic = list[0]
        const fetchPrevious = pageSize => sdkMosaic.getMosaicsSinceIdWithLimit(pageSize, mosaic.id)
        const fetchLive = pageSize => sdkMosaic.getMosaicsSinceIdWithLimit(pageSize)
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Reset the mosaic page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      try {
        if (!getters.getTimeline.isLive) {
          const data = await sdkMosaic.getMosaicsFromIdWithLimit(2 * Constants.PageSize)
          commit('setTimeline', Timeline.fromData(data))
        }
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch data from the SDK.
    async fetchMosaicInfo({ commit }, mosaicHexOrNamespace) {
      commit('mosaicInfoError', false)
      commit('mosaicInfoLoading', true)

      let mosaicInfo

      try {
        mosaicInfo = await sdkMosaic.getMosaicInfoFormatted(mosaicHexOrNamespace)
      } catch (e) {
        console.error(e)
        commit('mosaicInfoError', true)
      }

      if (mosaicInfo) {
        commit('setMosaicInfo', mosaicInfo.mosaicInfo)
        commit('setMetadataList', mosaicInfo.metadataList)
      }

      commit('mosaicInfoLoading', false)
    }
  }
}
