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
import * as nem from 'nem2-sdk'
import Timeline from './timeline'
import util from './util'
import sdkTransaction from '../infrastructure/getTransaction'

const PAGES = {
  // Recent block pages.
  recent: Timeline.empty(),
  // Pending block pages.
  pending: Timeline.empty(),
  // Transfer block pages.
  transfer: Timeline.empty(),
  // Multisig block pages.
  multisig: Timeline.empty(),
  // Mosaic block pages.
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
    // Holds the latest PAGE_SIZE transactions.
    latestList: [],
    // The current transaction type key, as defined in `PAGES`.
    transactionType: 'recent',
    ...PAGES,
    // Subscription to new transactions.
    subscription: null,
    // Determine if the transactions model is loading.
    loading: false,
    // TransactionInfo by hash.
    transactionInfo: {},
    // Transaction Body Info.
    transactionDetail: {},
    transactionInfoLoading: false,
    transactionInfoError: false
  },
  getters: {
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }),
    getTransactionType: state => state.transactionType,
    getTimeline: state => state[state.transactionType],
    getCanFetchPrevious: (state, getters) => getters.getTimeline.canFetchPrevious,
    getCanFetchNext: (state, getters) => getters.getTimeline.canFetchNext,
    getTimelineList: (state, getters) => getters.getTimeline.current,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      height: el.height,
      age: el.date,
      transactions: el.numTransactions,
      fee: el.totalFee,
      date: el.date,
      harvester: el.signer.address.address
    })),

    getSubscription: state => state.subscription,
    getLoading: state => state.loading,
    transactionInfo: state => state.transactionInfo,
    transactionDetail: state => state.transactionDetail,
    transferMosaics: state => state.transferMosaics,
    aggregateInnerTransactions: state => state.aggregateInnerTransactions,
    aggregateCosignatures: state => state.aggregateCosignatures,
    transactionInfoLoading: state => state.transactionInfoLoading,
    transactionInfoError: state => state.transactionInfoError
  },
  mutations: {
    setLatestList: (state, list) => { state.latestList = list },
    setTransactionType: (state, transactionType) => { state.transactionType = transactionType },
    setTimeline: (state, timeline) => { state[state.transactionType] = timeline },
    setTimelineWithType: (state, { timeline, type }) => { state[type] = timeline },

    setSubscription: (state, subscription) => { state.subscription = subscription },
    setLoading: (state, loading) => { state.loading = loading },
    addLatestItem(state, item) {
      // TODO(ahuszagh) Actually implement...
      // util.addLatestItemByKey(state, item, 'hash', 1)
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
    async initialize({ dispatch }) {
      dispatch('initializeSdk')
      await dispatch('initializePage')
      await dispatch('subscribe')
    },

    // Set node url to SDK
    initializeSdk({ rootGetters }) {
      sdkTransaction.init(rootGetters['api/currentNode'].url)
    },

    // Uninitialize the transaction model.
    uninitialize({ dispatch }) {
      dispatch('unsubscribe')
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
    async initializePage({ commit }) {
      commit('setLoading', true)
      for (let transactionType of Object.keys(PAGES)) {
        const type = TRANSACTION_TYPE_MAP[transactionType]
        let data = await sdkTransaction.getTransactionsFromHashWithLimit(2 * Timeline.pageSize, type)
        commit('setTimelineWithType', { timeline: Timeline.fromData(data), type: transactionType })
      }
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
      const transaction = list[list.length - 1]
      const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
      const fetchNext = pageSize => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, type, transaction.transactionHash)
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
      const transaction = list[0]
      const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
      const fetchPrevious = pageSize => sdkTransaction.getTransactionsSinceHashWithLimit(pageSize, type, transaction.transactionHash)
      const fetchLive = pageSize => sdkTransaction.getTransactionsSinceHashWithLimit(pageSize, type)
      commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      commit('setLoading', false)
    },

    // Change the current page.
    async changePage({ commit, getters }, transactionType) {
      commit('setLoading', true)
      if (getters.getTransactionType !== transactionType) {
        if (!getters.getTimeline.isLive) {
          // Reset to the live page.
          const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
          let data = await sdkTransaction.getTransactionsFromHashWithLimit(Timeline.pageSize, type)
          commit('setTimeline', Timeline.fromData(data))
        }
        commit('setTransactionType', transactionType)
      }
      commit('setLoading', false)
    },

    // Reset the current page type and page index.
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      if (getters.getTransactionType !== 'recent') {
        if (getters.getPageIndex !== 0) {
          // Reset to the live page.
          const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
          let data = await sdkTransaction.getTransactionsFromHashWithLimit(Timeline.pageSize, type)
          commit('setTimeline', Timeline.fromData(data))
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
      try {
        transactionInfo = await sdkTransaction.getTransactionInfoByHash(hash)
      } catch (e) {
        console.error(e)
        commit('transactionInfoError', true)
      }

      if (transactionInfo) {
        let formattedTransactionInfo = {
          blockHeight: transactionInfo.transaction.blockHeight,
          transactionHash: transactionInfo.transaction.transactionHash,
          transactionId: transactionInfo.transaction.transactionId,
          date: transactionInfo.timestamp,
          deadline: transactionInfo.transaction.deadline,
          fee: transactionInfo.transaction.fee,
          signature: transactionInfo.transaction.signature,
          signer: transactionInfo.transaction.signer,
          status: transactionInfo.status,
          confirm: transactionInfo.confirm
        }

        commit('transactionInfo', formattedTransactionInfo)

        let transactionBody = transactionInfo.transaction.transactionBody
        let formattedTransactionDetail = {}
        let formattedTransferMosaics = []
        let formattedAggregateInnerTransactions = []
        let formattedAggregateCosignatures = []

        // Reset to Empty Array
        commit('transferMosaics', formattedTransferMosaics)
        commit('aggregateInnerTransactions', formattedAggregateInnerTransactions)
        commit('aggregateCosignatures', formattedAggregateCosignatures)

        switch (transactionBody.typeId) {
          case nem.TransactionType.TRANSFER:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              recipient: transactionBody.recipient,
              message: transactionBody.message
            }

            formattedTransferMosaics = transactionBody.mosaics.map((el) => ({
              mosaicId: el.id,
              amount: el.amount
            }))

            commit('transferMosaics', formattedTransferMosaics)
            break

          case nem.TransactionType.REGISTER_NAMESPACE:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              registrationType: transactionBody.registrationType,
              namespaceName: transactionBody.namespaceName,
              namespaceId: transactionBody.namespaceId,
              parentId: transactionBody.parentId,
              duration: transactionBody.duration
            }
            break

          case nem.TransactionType.ADDRESS_ALIAS:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              aliasAction: transactionBody.aliasAction,
              namespaceId: transactionBody.namespaceId
            }
            break

          case nem.TransactionType.MOSAIC_ALIAS:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              aliasAction: transactionBody.aliasAction,
              namespaceId: transactionBody.namespaceId,
              mosaicId: transactionBody.mosaicId
            }
            break

          case nem.TransactionType.MOSAIC_DEFINITION:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              mosaicId: transactionBody.mosaicId,
              divisibility: transactionBody.divisibility,
              duration: transactionBody.duration,
              nonce: transactionBody.nonce,
              supplyMutable: transactionBody.supplyMutable,
              transferable: transactionBody.transferable,
              restrictable: transactionBody.restrictable
            }
            break

          case nem.TransactionType.MOSAIC_SUPPLY_CHANGE:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              mosaicId: transactionBody.mosaicId,
              action: transactionBody.action,
              delta: transactionBody.delta
            }
            break

          case nem.TransactionType.MODIFY_MULTISIG_ACCOUNT:
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.AGGREGATE_COMPLETE:
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }

            formattedAggregateInnerTransactions = transactionBody.innerTransactions.map((el) => ({
              transactionId: el.transactionId,
              type: el.transactionBody.type,
              signer: el.signer,
              transactionBody: el.transactionBody
            }))

            commit('aggregateInnerTransactions', formattedAggregateInnerTransactions)

            formattedAggregateCosignatures = transactionBody.cosignatures.map((el) => ({
              signature: el.signature,
              signer: el.signer
            }))

            commit('aggregateCosignatures', formattedAggregateCosignatures)
            break

          case nem.TransactionType.AGGREGATE_BONDED:
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }

            formattedAggregateInnerTransactions = transactionBody.innerTransactions.map((el) => ({
              transactionId: el.transactionId,
              type: el.transactionBody.type,
              signer: el.signer,
              transactionBody: el.transactionBody
            }))

            commit('aggregateInnerTransactions', formattedAggregateInnerTransactions)

            formattedAggregateCosignatures = transactionBody.cosignatures.map((el) => ({
              signature: el.signature,
              signer: el.signer
            }))

            commit('aggregateCosignatures', formattedAggregateCosignatures)
            break

          case nem.TransactionType.LOCK:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              duration: transactionBody.duration,
              mosaicId: transactionBody.mosaicId,
              amount: transactionBody.amount
            }
            break

          case nem.TransactionType.SECRET_LOCK:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              duration: transactionBody.duration,
              mosaicId: transactionBody.mosaicId,
              secret: transactionBody.secret,
              recipient: transactionBody.recipient,
              hashType: transactionBody.hashType
            }
            break

          case nem.TransactionType.SECRET_PROOF:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.LINK_ACCOUNT:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              linkAction: transactionBody.linkAction,
              remoteAccountPublicKey: transactionBody.remoteAccountPublicKey,
              remoteAccountAddress: transactionBody.remoteAccountAddress
            }
            break

          default:
            break
        }

        commit('transactionDetail', formattedTransactionDetail)
      }

      commit('transactionInfoLoading', false)
    }
  }
}
