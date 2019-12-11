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
import sdkNamespace from '../infrastructure/getNamespace'

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Timeline of data current in the view.
    timeline: Timeline.empty(),
    // Determine if the namespaces model is loading.
    loading: false,
    // Determine if the namespaces model has an error.
    error: false,
    // The Namespace detail information.
    namespaceInfo: {},
    // The Namespace Level.
    namespaceLevels: [],
    // The Namespace Metadata list.
    metadataList: [],
    namespaceInfoLoading: false,
    namespaceInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getTimeline: state => state.timeline,
    getCanFetchPrevious: state => state.timeline.canFetchPrevious,
    getCanFetchNext: state => state.timeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      namespaceId: el.namespaceId,
      namespaceName: el.namespaceName,
      registrationType: el.registrationType,
      owneraddress: el.address,
      parentId: el.parentId,
      startHeight: el.startHeight,
      depth: el.depth
    })),
    getLoading: state => state.loading,
    getError: state => state.error,
    getNamespaceInfo: state => state.namespaceInfo,
    getNamespaceLevels: state => state.namespaceLevels,
    getMetadataList: state => state.metadataList,
    namespaceInfoLoading: state => state.namespaceInfoLoading,
    namespaceInfoError: state => state.namespaceInfoError
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setTimeline: (state, timeline) => { state.timeline = timeline },
    setLoading: (state, loading) => { state.loading = loading },
    setError: (state, error) => { state.error = error },
    setNamespaceInfo: (state, info) => { state.namespaceInfo = info },
    setNamespaceLevels: (state, levels) => { state.namespaceLevels = levels },
    setMetadataList: (state, metadataList) => { state.metadataList = metadataList },
    namespaceInfoLoading: (state, v) => { state.namespaceInfoLoading = v },
    namespaceInfoError: (state, v) => { state.namespaceInfoError = v }
  },
  actions: {
    // Initialize the namespace model.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the namespace model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {}
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      try {
        let namespaceList = await sdkNamespace.getNamespacesFromIdWithLimit(2 * Constants.PageSize)
        commit('setTimeline', Timeline.fromData(namespaceList))
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
        const namespace = list[list.length - 1]
        const fetchNext = pageSize => sdkNamespace.getNamespacesFromIdWithLimit(pageSize, namespace.id)
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
        const namespace = list[0]
        const fetchPrevious = pageSize => sdkNamespace.getNamespacesSinceIdWithLimit(pageSize, namespace.id)
        const fetchLive = pageSize => sdkNamespace.getNamespacesSinceIdWithLimit(pageSize)
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Reset the namespace page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      try {
        if (!getters.getTimeline.isLive) {
          const data = await sdkNamespace.getNamespacesFromIdWithLimit(2 * Constants.PageSize)
          commit('setTimeline', Timeline.fromData(data))
        }
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch data from the SDK.
    async fetchNamespaceInfo({ commit }, namespaceOrHex) {
      commit('namespaceInfoError', false)
      commit('namespaceInfoLoading', true)

      let namespaceInfo

      try { namespaceInfo = await sdkNamespace.getNamespaceInfoFormatted(namespaceOrHex) } catch (e) {
        console.error(e)
        commit('namespaceInfoError', true)
      }

      if (namespaceInfo) {
        commit('setNamespaceInfo', namespaceInfo.namespaceInfo)
        commit('setNamespaceLevels', namespaceInfo.namespaceLevels)
        commit('setMetadataList', namespaceInfo.metadataList)
      }

      commit('namespaceInfoLoading', false)
    }
  }
}
