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
import util from './util'
import sdkBlock from '../infrastructure/getBlock'
import sdkListener from '../infrastructure/getListener'

export default {
  namespaced: true,
  state: {
    // Holds the latest PAGE_SIZE blocks.
    latestList: [],
    // Holds the PAGE_SIZE blocks starting from current page.
    pageList: [],
    // The current page index (0-indexed).
    pageIndex: 0,
    // Subscription to new blocks.
    subscription: null,
    // Determine if the blocks model is loading.
    loading: false,
    // The Block Information.
    blockInfo: {},
    // The Block Transaction list
    blockTransactionList: [],
    currentBlockHeight: null,
    blockInfoLoading: false,
    blockInfoError: false
  },
  getters: {
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }),
    getPageList: state => state.pageList,
    getPageListFormatted: (state, getters) => getters.getPageList.map(el => ({
      height: el.height,
      age: el.date,
      transactions: el.numTransactions,
      fee: el.totalFee,
      date: el.date,
      harvester: el.signer.address.address
    })),
    getPageIndex: state => state.pageIndex,
    getSubscription: state => state.subscription,
    getLoading: state => state.loading,
    blockInfo: state => state.blockInfo,
    blockTransactionList: state => state.blockTransactionList,
    currentBlockHeight: state => state.currentBlockHeight,
    blockInfoLoading: state => state.blockInfoLoading,
    blockInfoError: state => state.blockInfoError
  },
  mutations: {
    setLatestList: (state, list) => { state.latestList = list },
    setPageList: (state, list) => { state.pageList = list },
    setPageIndex: (state, pageIndex) => { state.pageIndex = pageIndex },
    setSubscription: (state, subscription) => { state.subscription = subscription },
    setLoading: (state, loading) => { state.loading = loading },
    resetPageIndex: (state) => { state.pageIndex = 0 },

    addLatestItem: (state, item) => {
      if (state.latestList.length > 0 && state.latestList[0].height !== item.height) {
        util.prependItem(state.latestList, item)
        if (state.pageIndex === 0) {
          util.prependItem(state.pageList, item)
        }
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
    async initialize({ dispatch }) {
      await dispatch('initializePage')
      await dispatch('subscribe')
    },

    // Uninitialize the block model.
    uninitialize({ dispatch }) {
      dispatch('unsubscribe')
    },

    // Subscribe to the latest blocks.
    async subscribe({ commit, dispatch, getters }) {
      if (getters.getSubscription === null) {
        let subscription = await sdkListener.subscribeNewBlock(dispatch)
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
    add({ commit }, item) {
      commit('chain/setBlockHeight', item.height, { root: true })
      commit('addLatestItem', item)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      let blockList = await sdkBlock.getBlocksFromHeightWithLimit(util.PAGE_SIZE)
      commit('setLatestList', blockList)
      commit('setPageList', [...blockList])
      if (blockList.length > 0) {
        commit('chain/setBlockHeight', blockList[0].height, { root: true })
      }
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageList.length > 0) {
        // Page is loaded, need to fetch next page.
        const block = pageList[pageList.length - 1]
        let blockList = await sdkBlock.getBlocksFromHeightWithLimit(util.PAGE_SIZE, block.height)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', blockList)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageIndex === 1) {
        // Can specialize for the latest list.
        commit('setPageIndex', 0)
        commit('setPageList', getters.getLatestList)
      } else if (pageIndex > 0 && pageList.length > 0) {
        // Page is loaded, not the first page, need to fetch previous page.
        const block = pageList[0]
        let blockList = await sdkBlock.getBlocksSinceHeightWithLimit(util.PAGE_SIZE, block.height)
        commit('setPageIndex', pageIndex - 1)
        commit('setPageList', blockList)
      }
      commit('setLoading', false)
    },

    // Reset the block page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      if (getters.getPageIndex > 0) {
        commit('setPageList', getters.getLatestList)
        commit('resetPageIndex')
      }
    },

    getBlockInfo: async ({ commit }, height) => {
      commit('blockInfoError', false)
      commit('blockInfoLoading', true)

      try {
        const blockInfo = await sdkBlock.getBlockInfoByHeight(height)
        commit('currentBlockHeight', blockInfo.height)

        const blockTransactionList = await sdkBlock.getBlockFullTransactionsList(
          height
        )

        let blockInfoObject = {
          height: blockInfo.height,
          date: blockInfo.date,
          fee: blockInfo.totalFee,
          difficulty: blockInfo.difficulty,
          totalTransactions: blockInfo.numTransactions,
          harvester: blockInfo.signer.address.address,
          blockHash: blockInfo.hash
        }

        let blockTransactionListObject = []
        if (blockTransactionList.length) {
          blockTransactionListObject = blockTransactionList.map((el) => ({
            deadline: el.deadline,
            transactionHash: el.transactionHash,
            fee: el.fee,
            signer: el.signer,
            type: el.transactionBody.type
          }))
        }
        commit('blockInfo', blockInfoObject)
        commit('blockTransactionList', blockTransactionListObject)
      } catch (e) {
        console.error(e)
        commit('blockInfoError', true)
        commit('blockInfo', {})
        commit('blockTransactionList', [])
      }
      commit('blockInfoLoading', false)
    },

    nextBlock: ({ commit, getters, dispatch }) => {
      dispatch('ui/openPage', {
        pageName: 'block',
        param: getters.currentBlockHeight + 1
      }, { root: true })
    },
    previousBlock: ({ commit, getters, dispatch }) => {
      dispatch('ui/openPage', {
        pageName: 'block',
        param: getters.currentBlockHeight - 1
      }, { root: true })
    }
  }
}
