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

import Vue from 'vue'
import Lock from './lock'
import Timeline from './timeline'
import Constants from '../config/constants'
import sdkBlock from '../infrastructure/getBlock'
import sdkListener from '../infrastructure/getListener'

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Holds the latest PageSize blocks.
    latestList: [],
    // Timeline of data current in the view.
    timeline: Timeline.empty(),
    // Subscription to new blocks.
    subscription: null,
    // Determine if the blocks model is loading.
    loading: false,
    // Determine if the blocks model has an error.
    error: false,
    // The Block Information.
    blockInfo: {},
    // The Block Transaction list
    blockTransactionList: [],
    currentBlockHeight: null,
    blockInfoLoading: false,
    blockInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }),
    getTimeline: state => state.timeline,
    getCanFetchPrevious: state => state.timeline.canFetchPrevious,
    getCanFetchNext: state => state.timeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      height: el.height,
      age: el.date,
      transactions: el.numTransactions,
      fee: el.totalFee,
      date: el.date,
      harvester: el.signer
    })),
    getSubscription: state => state.subscription,
    getLoading: state => state.loading,
    getError: state => state.error,
    blockInfo: state => state.blockInfo,
    blockTransactionList: state => state.blockTransactionList,
    currentBlockHeight: state => state.currentBlockHeight,
    blockInfoLoading: state => state.blockInfoLoading,
    blockInfoError: state => state.blockInfoError,

    infoText: (s, g, rs, rootGetters) => 'Chain height: ' + rootGetters['chain/getBlockHeight']
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setLatestList: (state, list) => { state.latestList = list },
    setTimeline: (state, timeline) => { state.timeline = timeline },
    setSubscription: (state, subscription) => { state.subscription = subscription },
    setLoading: (state, loading) => { state.loading = loading },
    setError: (state, error) => { state.error = error },

    addLatestItem: (state, item) => {
      if (state.latestList.length > 0 && state.latestList[0].height !== item.height && state.timeline.isLive === true) {
        Timeline.prependItem(state.latestList, item)
        state.timeline = state.timeline.addLatestItem(item, 'height')
      }
    },

    blockInfo: (state, blockInfo) => Vue.set(state, 'blockInfo', blockInfo),
    blockTransactionList: (state, blockTransactionList) => Vue.set(state, 'blockTransactionList', blockTransactionList),
    currentBlockHeight: (state, currentBlockHeight) => Vue.set(state, 'currentBlockHeight', currentBlockHeight),
    blockInfoLoading: (state, blockInfoLoading) => Vue.set(state, 'blockInfoLoading', blockInfoLoading),
    blockInfoError: (state, blockInfoError) => Vue.set(state, 'blockInfoError', blockInfoError)
  },
  actions: {
    // Initialize the block model.
    // First fetch the page, then subscribe.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
        await dispatch('subscribe')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the block model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        dispatch('unsubscribe')
      }
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Subscribe to the latest blocks.
    async subscribe({ commit, dispatch, getters, rootGetters }) {
      if (getters.getSubscription === null) {
        let subscription = await sdkListener.subscribeNewBlock(dispatch, rootGetters['api/wsEndpoint'])
        commit('setSubscription', subscription)
      }
    },

    // Unsubscribe from the latest blocks.
    unsubscribe({ commit, getters }) {
      let subscription = getters.getSubscription
      if (subscription !== null) {
        subscription[1].unsubscribe()
        subscription[0].close()
        commit('setSubscription', null)
      }
    },

    // Add block to latest blocks.
    async add({ commit }, item) {
      commit('chain/setBlockHeight', item.height, { root: true })

      // WS no return numTransactions, use http request to get numTransactions.
      if (item.numTransactions === undefined) {
        try {
          let blockInfo = await sdkBlock.getBlockInfoByHeightFormatted(item.height)
          item.numTransactions = blockInfo.blockInfo.totalTransactions
        } catch (e) {
          console.error(e)
        }
      }

      commit('addLatestItem', item)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      try {
        let blockList = await sdkBlock.getBlocksFromHeightWithLimit(2 * Constants.PageSize)
        commit('setLatestList', blockList.slice(0, Constants.PageSize))
        if (blockList.length > 0) {
          commit('chain/setBlockHeight', blockList[0].height, { root: true })
        }
        commit('setTimeline', Timeline.fromData(blockList))
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
        const block = list[list.length - 1]
        const fetchNext = pageSize => sdkBlock.getBlocksFromHeightWithLimit(pageSize, block.height)
        commit('setTimeline', await timeline.shiftNext(fetchNext))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters, rootGetters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.previous
      try {
        if (list.length === 0) {
          throw new Error('internal error: previous list is 0.')
        }
        const block = list[0]
        const fetchPrevious = pageSize => sdkBlock.getBlocksSinceHeightWithLimit(pageSize, block.height)
        const fetchLive = pageSize => sdkBlock.getBlocksFromHeightWithLimit(pageSize, rootGetters['chain/getBlockHeight'])
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Reset the block page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      try {
        if (!getters.getTimeline.isLive) {
          const data = await sdkBlock.getBlocksFromHeightWithLimit(2 * Constants.PageSize)
          commit('setTimeline', Timeline.fromData(data))
        }
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    getBlockInfo: async ({ commit, dispatch }, height) => {
      commit('blockInfoError', false)
      commit('blockInfoLoading', true)
      commit('blockInfo', {})
      commit('blockTransactionList', [])
      commit('currentBlockHeight', height)

      dispatch('chain/getBlockHeight', null, { root: true })



      let blockInfo
      try { blockInfo = await sdkBlock.getBlockInfoByHeightFormatted(height) } catch (e) {
        console.error(e)
        commit('blockInfoError', true)
      }

      if (blockInfo) {
        commit('blockInfo', blockInfo.blockInfo)
        commit('blockTransactionList', blockInfo.transactionList)
      }

      commit('blockInfoLoading', false)
    },

    nextBlock: ({ commit, getters, dispatch, rootGetters }) => {
      console.log(getters.currentBlockHeight, rootGetters['chain/getBlockHeight'])
      if(getters.currentBlockHeight < rootGetters['chain/getBlockHeight'])
      dispatch('ui/openPage', {
        pageName: 'block',
        param: +getters.currentBlockHeight + 1
      }, { root: true })
    },
    previousBlock: ({ commit, getters, dispatch }) => {
      if(+getters.currentBlockHeight > 1)
      dispatch('ui/openPage', {
        pageName: 'block',
        param: +getters.currentBlockHeight - 1
      }, { root: true })
    }
  }
}
