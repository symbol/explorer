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
import Constants from '../config/constants'
import sdkTransaction from '../infrastructure/getTransaction'
import { 
  Filter, 
  DataSet, 
  Timeline, 
  getStateFromManagers,
  getGettersFromManagers,
  getMutationsFromManagers,
  getActionsFromManagers
} from './manager'

const LOCK = Lock.create()

const managers = [
  new Timeline(
    'recent',
    () => sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize),
    (key, pageSize) => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, void 0, key),
    'transactionHash'
  ),
  new Timeline(
    'pending',
    () => sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, 'unconfirmed'),
    (key, pageSize) => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, 'unconfirmed', key),
    'transactionHash'
  ),
  new Timeline(
    'transfer',
    () => sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, 'transfer'),
    (key, pageSize) => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, 'transfer', key),
    'transactionHash'
  ),
  new Timeline(
    'multisig',
    () => sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, 'transfer/multisig'),
    (key, pageSize) => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, 'transfer/multisig', key),
    'transactionHash'
  ),
  new Timeline(
    'mosaic',
    () => sdkTransaction.getTransactionsFromHashWithLimit(Constants.PageSize, 'transfer/mosaic'),
    (key, pageSize) => sdkTransaction.getTransactionsFromHashWithLimit(pageSize, 'transfer/mosaic', key),
    'transactionHash'
  ),
  new Filter(
    'timeline',
    {
      recent: 'Recent',
      pending: 'Pending Transactions',
      transfer: 'Transfer Transactions',
      multisig: 'Multisig Transactions',
      mosaic: 'Mosaic Transactions'
    }
  ),
  new DataSet(
    'info',
    (hash) => sdkTransaction.getTransactionInfoFormatted(hash)
  )
]

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    ...getStateFromManagers(managers)
  },
  getters: {
    getInitialized: state => state.initialized,
    ...getGettersFromManagers(managers),
    transactionInfo: state => state.info?.data?.transactionInfo || {},
    transactionDetail: state => state.info?.data?.transactionDetail || {},
    transferMosaics: state => state.info?.data?.transferMosaics || [],
    aggregateInnerTransactions: state => state.info?.data?.aggregateInnerTransactions || [],
    aggregateCosignatures: state => state.info?.data?.aggregateCosignatures || [],
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    ...getMutationsFromManagers(managers)
  },
  actions: {
    ...getActionsFromManagers(managers),

    // Initialize the transaction model. First fetch the page, then subscribe.
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
    async initializePage(context) {
      await context.getters.recent.setStore(context)
      await context.getters.pending.setStore(context)
      await context.getters.transfer.setStore(context)
      await context.getters.multisig.setStore(context)
      await context.getters.mosaic.setStore(context)
      await context.getters.timeline.setStore(context).initialFetch();
    },

    async getTransactionInfoByHash(context, hash) {
      await context.getters.info.setStore(context).initialFetch(hash);
    }
  }
}
