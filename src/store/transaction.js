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
import util from './util'
import sdkTransaction from '../infrastructure/getTransaction'

const PAGE_DEFAULT = {
  // Holds the PAGE_SIZE transactions starting from current page.
  pageList: [],
  // The current page index (0-indexed).
  pageIndex: 0,
}

const PAGES = {
  // Recent block pages.
  recent: { ...PAGE_DEFAULT },
  // Pending block pages.
  pending: { ...PAGE_DEFAULT },
  // Transfer block pages.
  transfer: { ...PAGE_DEFAULT },
  // Multisig block pages.
  multisig: { ...PAGE_DEFAULT },
  // Mosaic block pages.
  mosaic: { ...PAGE_DEFAULT },
}

// Map the page name to the transaction type.
const TRANSACTION_TYPE_MAP = {
  recent: undefined,
  pending: 'unconfirmed',
  transfer: 'transfer',
  multisig: 'transfer/multisig',
  mosaic: 'transfer/mosaic',
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
    transactionInfoLoading: false
  },
  getters: {
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }),
    getTransactionType: state => state.transactionType,
    getPageList: state => state[state.transactionType].pageList,
    getPageIndex: state => state[state.transactionType].pageIndex,
    getPageListFormatted: (state, getters) => getters.getPageList.map(el => ({
      // TODO(ahuszagh) Likely need to rework this.
      deadline: el.deadline,
      blockHeight: el.blockHeight,
      transactionId: el.transactionId,
      transactionHash: el.transactionHash,
      fee: el.fee
    })),
    getSubscription: state => state.subscription,
    getLoading: state => state.loading,
    transactionInfo: state => state.transactionInfo,
    transactionDetail: state => state.transactionDetail,
    transferMosaics: state => state.transferMosaics,
    aggregateInnerTransactions: state => state.aggregateInnerTransactions,
    aggregateCosignatures: state => state.aggregateCosignatures,
    transactionInfoLoading: state => state.transactionInfoLoading
  },
  mutations: {
    setLatestList: (state, list) => { state.latestList = list },
    setTransactionType: (state, transactionType) => { state.transactionType = transactionType },
    setPageList: (state, list) => { state[state.transactionType].pageList = list },
    setPageListWithType: (state, { list, type }) => { state[type].pageList = list },
    setPageIndex: (state, pageIndex) => { state[state.transactionType].pageIndex = pageIndex },
    setSubscription: (state, subscription) => { state.subscription = subscription },
    setLoading: (state, loading) => { state.loading = loading },
    // TODO(ahuszagh) Likely need to rework this.
    // This isn't great.
    resetPageIndex: (state) => { state[state.transactionType].pageIndex = 0 },
    addLatestItem(state, item) {
      // TODO(ahuszagh) Actually implement...
      //util.addLatestItemByKey(state, item, 'hash', 1)
    },

    // TODO(ahuszagh) Bad names....
    transactionInfo: (state, transactionInfo) => Vue.set(state, 'transactionInfo', transactionInfo),
    transactionDetail: (state, transactionDetail) => Vue.set(state, 'transactionDetail', transactionDetail),
    transferMosaics: (state, transferMosaics) => Vue.set(state, 'transferMosaics', transferMosaics),
    aggregateInnerTransactions: (state, aggregateInnerTransactions) => Vue.set(state, 'aggregateInnerTransactions', aggregateInnerTransactions),
    aggregateCosignatures: (state, aggregateCosignatures) => Vue.set(state, 'aggregateCosignatures', aggregateCosignatures),
    transactionInfoLoading: (state, v) => { state.transactionInfoLoading = v },
  },
  actions: {
    // Initialize the transaction model.
    // First fetch the page, then subscribe.
    async initialize({ dispatch }) {
      await dispatch('initializePage')
      await dispatch('subscribe')
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

    // Add block to latest transactions.
    add({ commit }, item) {
      // TODO(ahuszagh) Also need to rework this.
      // Need to consider transaction type.
//      commit('chain/setTransactionHash', item.transactionHash, { root: true })
//      commit('addLatestItem', item)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      for (var transactionType of Object.keys(PAGES)) {
        const type = TRANSACTION_TYPE_MAP[transactionType]
        let transactionList = await sdkTransaction.getTransactionsFromHashWithLimit(util.PAGE_SIZE, type)
        commit('setPageListWithType', { list: transactionList, type: transactionType})
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
        const transaction = pageList[pageList.length - 1]
        const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
        let transactionList = await sdkTransaction.getTransactionsFromHashWithLimit(util.PAGE_SIZE, type, transaction.transactionHash)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', transactionList)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageIndex > 0 && pageList.length > 0) {
        // Page is loaded, need to fetch previous page.
        const transaction = pageList[0]
        const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
        let transactionList = await sdkTransaction.getTransactionsSinceHashWithLimit(util.PAGE_SIZE, type, transaction.transactionHash)
        commit('setPageIndex', pageIndex - 1)
        commit('setPageList', transactionList)
      }
      commit('setLoading', false)
    },

    // Change the current page.
    async changePage({ commit, getters }, transactionType) {
      commit('setLoading', true)
      if (getters.getTransactionType !== transactionType) {
        if (getters.getPageIndex !== 0) {
          // Reset to the first page.
          const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
          let transactionList = await sdkTransaction.getTransactionsFromHashWithLimit(util.PAGE_SIZE, type)
          commit('setPageIndex', 0)
          commit('setPageList', transactionList)
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
          // Reset to the first page.
          const type = TRANSACTION_TYPE_MAP[getters.getTransactionType]
          let transactionList = await sdkTransaction.getTransactionsFromHashWithLimit(util.PAGE_SIZE, type)
          commit('setPageIndex', 0)
          commit('setPageList', transactionList)
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
              direction: transactionBody.direction,
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
              recipient: el.transactionBody.recipient
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
              recipient: el.transactionBody.recipient
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
