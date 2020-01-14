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
import sdkNode from '../infrastructure/getNode'

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Timeline of data current in the view.
    timeline: Timeline.empty(),
    // Determine if the nodes model is loading.
    loading: false,
    // Determine if the nodes model has an error.
    error: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getTimeline: state => state.timeline,
    getCanFetchPrevious: state => state.timeline.canFetchPrevious,
    getCanFetchNext: state => state.timeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      version: el.version,
      roles: el.roles,
      network: el.network,
      host: el.host,
      port: el.port,
      address: el.address,
      friendlyName: el.friendlyName
    })),
    getLoading: state => state.loading,
    getError: state => state.error
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setTimeline: (state, timeline) => { state.timeline = timeline },
    setLoading: (state, loading) => { state.loading = loading },
    setError: (state, error) => { state.error = error }
  },
  actions: {
    // Initialize the node model.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the node model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {}
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      try {
        const nodeList = await sdkNode.getNodes()
        commit('setTimeline', Timeline.fromData(nodeList))
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
        if (list.length === 0)
          throw new Error('internal error: next list is 0.')

        const node = list[list.length - 1] // eslint-disable-line no-unused-vars
        const fetchNext = async pageSize => []
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
        if (list.length === 0)
          throw new Error('internal error: previous list is 0.')

        const node = list[0] // eslint-disable-line no-unused-vars
        const fetchPrevious = async pageSize => []
        const fetchLive = async pageSize => sdkNode.getNodes()
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Reset the node page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      try {
        if (!getters.getTimeline.isLive) {
          const data = await sdkNode.getNodes()
          commit('setTimeline', Timeline.fromData(data))
        }
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    }
  }
}
