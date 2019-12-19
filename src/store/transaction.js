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
import sdkTransaction from '../infrastructure/getTransaction'

const LOCK = Lock.create()

const TIMELINES = {
  // Recent transactions.
  recent: Timeline.empty(),
  // Pending transactions.
  pending: Timeline.empty(),
  // Transfer transactions.
  transfer: Timeline.empty(),
  // Multisig transactions.
  multisig: Timeline.empty(),
  // Mosaic transactions.
  mosaic: Timeline.empty()
}

// Map the page name to the transaction type.
const TRANSACTION_TYPE_MAP = {
  recent: undefined,
  pending: 'unconfirmed',
  transfer: 'transfer',
  multisig: 'transfer/multisig',
  mosaic: 'transfer/mosaic'
}

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Holds the latest PageSize transactions.
    latestList: [],
    // The current transaction type key, as defined in `TIMELINES`.
    transactionType: 'recent',
    ...TIMELINES,
    // Subscription to new transactions.
    subscription: null,
    // Determine if the transactions model is loading.
    loading: false,
    // Determine if the transactions model has an error.
    error: {
      recent: false,
      pending: false,
      transfer: false,
      multisig: false,
      mosaic: false
    },
    // TransactionInfo by hash.
    transactionInfo: {},
    // Transaction Body Info.
    transactionDetail: {},
    transactionInfoLoading: false,
    transactionInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }),
    getTransactionType: state => state.transactionType,
    getTimeline: state => state[state.transactionType],
    getCanFetchPrevious: (state, getters) => getters.getTimeline.canFetchPrevious,
    getCanFetchNext: (state, getters) => getters.getTimeline.canFetchNext,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      height: el.blockHeight,
      deadline: el.deadline,
      transactionHash: el.transactionHash,
      type: el.transactionBody.type,
      fee: el.fee,
      signer: el.signer,
      recipient: el.transactionBody.recipient
    })),

    getSubscription: state => state.subscription,
    getLoading: state => state.loading,
    getError: state => state.error[state.transactionType],
    transactionInfo: state => state.transactionInfo,
    transactionDetail: state => state.transactionDetail,
    transferMosaics: state => state.transferMosaics,
    aggregateInnerTransactions: state => state.aggregateInnerTransactions,
    aggregateCosignatures: state => state.aggregateCosignatures,
    transactionInfoLoading: state => state.transactionInfoLoading,
    transactionInfoError: state => state.transactionInfoError,
    filterValue: state => state.transactionType,
    filterOptions: () => ({
      'recent': 'Recent Transactions',
      'pending': 'Pending Transactions',
      'transfer': 'Transfer Transactions',
      'multisig': 'Multisig Transactions',
      'mosaic': 'Mosaic Transactions'
    })
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setLatestList: (state, list) => { state.latestList = list },
    setTransactionType: (state, transactionType) => { state.transactionType = transactionType },
    setTimeline: (state, timeline) => { state[state.transactionType] = timeline },
    setTimelineWithType: (state, { timeline, type }) => { state[type] = timeline },

    setSubscription: (state, subscription) => { state.subscription = subscription },
    setLoading: (state, loading) => { state.loading = loading },
    setError: (state, error) => { state.error[state.transactionType] = error },
    setErrorWithType: (state, { error, type }) => { state.error[type] = error },
    addLatestItem(state, item) {
      // TODO(ahuszagh) Actually implement...
    },

    transactionInfo: (state, transactionInfo) => Vue.set(state, 'transactionInfo', transactionInfo),
    transactionDetail: (state, transactionDetail) => Vue.set(state, 'transactionDetail', transactionDetail),
    transferMosaics: (state, transferMosaics) => Vue.set(state, 'transferMosaics', transferMosaics),
    aggregateInnerTransactions: (state, aggregateInnerTransactions) => Vue.set(state, 'aggregateInnerTransactions', aggregateInnerTransactions),
    aggregateCosignatures: (state, aggregateCosignatures) => Vue.set(state, 'aggregateCosignatures', aggregateCosignatures),
    transactionInfoLoading: (state, v) => { state.transactionInfoLoading = v },
    transactionInfoError: (state, v) => { state.transactionInfoError = v }
  },
  actions: {
    // Initialize the transaction model.
    // First fetch the page, then subscribe.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
        await dispatch('subscribe')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the transaction model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        dispatch('unsubscribe')
      }
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Subscribe to the latest transactions.
    async subscribe({ commit, dispatch, getters }) {
      // TODO(ahuszagh) Implement...
    },

    // Unsubscribe from the latest transactions.
    unsubscribe({ commit, getters }) {
      let subscription = getters.getSubscription
      if (subscription !== null) {
        subscription[1].unsubscribe()
        subscription[0].close()
        commit('setSubscription', null)
      }
    },

    // Add transaction to latest transactions.
    add({ commit }, item) {
      // TODO(ahuszagh) Also need to rework this.
      // Need to consider transaction type.
      //      commit('chain/setTransactionHash', item.transactionHash, { root: true })
      //      commit('addLatestItem', item)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit, getters }) {
      commit('setLoading', true)
      for (let transactionType of Object.keys(TIMELINES)) {
        const type = TRANSACTION_TYPE_MAP[transactionType]
        try {
          let data = await sdkTransaction.getTransactionsFromHashWithLimit(2 * Constants.PageSize, type)
          if (transactionType === 'recent') {
            commit('setLatestList', data.slice(0, Constants.PageSize))
          }
          commit('setTimelineWithType', { timeline: Timeline.fromData(data), type: transactionType })
        } catch (e) {
          console.error(e)
          commit('setErrorWithType', { error: true, type: transactionType })
        }
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
        const transaction = list[list.length - 1]
        const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
        const fetchNext = pageSize => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, type, transaction.transactionHash)
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
        const transaction = list[0]
        const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
        const fetchPrevious = pageSize => sdkTransaction.getTransactionsSinceHashWithLimit(pageSize, type, transaction.transactionHash)
        const fetchLive = pageSize => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, type)
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Change the current page.
    async changePage({ commit, getters }, transactionType) {
      commit('setLoading', true)
      if (getters.getTransactionType !== transactionType) {
        try {
          if (!getters.getTimeline.isLive) {
            // Reset to the live page.
            const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
            let data = await sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, type)
            commit('setTimeline', Timeline.fromData(data))
          }
        } catch (e) {
          console.error(e)
          commit('setError', true)
        }
        commit('setTransactionType', transactionType)
      }
      commit('setLoading', false)
    },

    // Reset the current page type and page index.
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      if (getters.getTransactionType !== 'recent') {
        try {
          if (!getters.getTimeline.isLive) {
            // Reset to the live page.
            const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
            let data = await sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, type)
            commit('setTimeline', Timeline.fromData(data))
          }
        } catch (e) {
          console.error(e)
          commit('setError', true)
        }
        commit('setTransactionType', 'recent')
      }
      commit('setLoading', false)
    },

    async getTransactionInfoByHash({ commit }, hash) {
      commit('transactionInfoLoading', true)
      commit('transactionInfoError', false)
      commit('transactionInfo', {})
      commit('transactionDetail', {})
      commit('transferMosaics', [])
      commit('aggregateInnerTransactions', [])
      commit('aggregateCosignatures', [])

      let transactionInfo
      try { transactionInfo = await sdkTransaction.getTransactionInfoFormatted(hash) } catch (e) {
        console.error(e)
        commit('transactionInfoError', true)
      }

      if (transactionInfo) {
        commit('transactionInfo', transactionInfo.transactionInfo)
        commit('transferMosaics', transactionInfo.transferMosaics)
        commit('aggregateInnerTransactions', transactionInfo.aggregateInnerTransactions)
        commit('aggregateCosignatures', transactionInfo.aggregateCosignatures)
        commit('transactionDetail', transactionInfo.transactionDetail)
      }

      commit('transactionInfoLoading', false)
    }
  }
}
