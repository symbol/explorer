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
import account from './account'
import api from './api'
import block from './block'
import chain from './chain'
import mosaic from './mosaic'
import namespace from './namespace'
import node from './node'
import transaction from './transaction'
import ui from './ui'
import helper from '../helper'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // Disable use-strict mode because it fails with the SDK listener.
  strict: false,
  modules: {
    api,
    block,
    chain,
    transaction,
    ui,
    account,
    mosaic,
    namespace,
    node
  },
  actions: {
    // Initialize the store (call on mount or re-initialization).
    // This handles initialization of a dependent item based on the
    // key provided.
    async initialize({ dispatch }, route) {
      // Initialize the API.
      await helper.logError(dispatch, 'api/initialize')

      switch (route.name) {
        // Home
        case 'home':
          // Home: Requires blocks, chain, and transactions.
          return Promise.all([
            helper.logError(dispatch, 'block/initialize'),
            helper.logError(dispatch, 'chain/initialize'),
            helper.logError(dispatch, 'transaction/initialize')
          ])

        // Timeline Views
        case 'accounts':
          return helper.logError(dispatch, 'account/initialize')
        case 'blocks':
          return helper.logError(dispatch, 'block/initialize')
        case 'mosaics':
          return helper.logError(dispatch, 'mosaic/initialize')
        case 'namespaces':
          return helper.logError(dispatch, 'namespace/initialize')
        case 'nodes':
          return helper.logError(dispatch, 'node/initialize')
        case 'transactions':
          return helper.logError(dispatch, 'transaction/initialize')

        // Detail Views
        case 'account-detail':
          return helper.logError(dispatch, 'account/fetchAccountDataByAddress', route.params.address || 0)
        case 'block-detail':
          return helper.logError(dispatch, 'block/getBlockInfo', route.params.height || 0)
        case 'mosaic-detail':
          return helper.logError(dispatch, 'mosaic/fetchMosaicInfo', route.params.mosaicId || 0)
        case 'namespace-detail':
          return helper.logError(dispatch, 'namespace/fetchNamespaceInfo', route.params.namespaceId || 0)
        case 'transaction-detail':
          return helper.logError(dispatch, 'transaction/getTransactionInfoByHash', route.params.transactionHash || '')
      }
    },

    // Uninitialize the stores (call on app destroyed).
    async uninitialize({ dispatch }) {
      await Promise.all([
        dispatch('account/uninitialize'),
        dispatch('block/uninitialize'),
        dispatch('chain/uninitialize'),
        dispatch('mosaic/uninitialize'),
        dispatch('namespace/uninitialize'),
        dispatch('transaction/uninitialize')
      ])
    }
  }
})
