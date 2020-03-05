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
import sdkBlock from '../infrastructure/getBlock'
import sdkListener from '../infrastructure/getListener'
import helper from '../helper'
import { 
  Filter, 
  DataSet, 
  Timeline, 
  getStateFromManagers,
  getGettersFromManagers,
  getMutationsFromManagers,
  getActionsFromManagers
} from './manager'

const managers = [
  new Timeline(
    'timeline',
    () => sdkBlock.getBlocksFromHeightWithLimit(Constants.PageSize),
    (key, pageSize) => sdkBlock.getBlocksFromHeightWithLimit(pageSize, key),
    'height'
  ),
  new Timeline(
    'blockTransactions',
    (pageSize, store) => sdkBlock.getBlockTransactions(store.currentBlockHeight),
    (key, pageSize, store) => sdkBlock.getBlockTransactions(store.currentBlockHeight, key),
    'transactionId',
    10
  ),
  new DataSet(
    'info',
    (height) => sdkBlock.getBlockInfoByHeightFormatted(height)
  )
]

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // Subscription to new blocks.
    subscription: null,
    currentBlockHeight: null,
    ...getStateFromManagers(managers)
  },
  getters: {
    ...getGettersFromManagers(managers),
    getInitialized: state => state.initialized,
    getLatestList: state => state.latestList,
    getRecentList: state => Array.prototype.filter.call(state.latestList, (item, index) => {
      return index < 4
    }), 
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      height: el.height,
      age: el.date,
      transactions: el.numTransactions,
      fee: el.totalFee,
      date: el.date,
      harvester: el.signer
    })),
    getSubscription: state => state.subscription,
    blockInfo: state => state.info?.data?.blockInfo || {},
    inflationReceipt: state => state.info?.data?.inflationReceipt || [],
    balanceTransferReceipt: state => state.info?.data?.balanceTransferReceipt || [],
    balanceChangeReceipt: state => state.info?.data?.balanceChangeReceipt || [],
    artifactExpiryReceipt: state => state.info?.data?.artifactExpiryReceipt || [],
    resolutionStatement: state => state.info?.data?.resolutionStatement || [],
    currentBlockHeight: state => state.currentBlockHeight,

    infoText: (s, g, rs, rootGetters) => 'Chain height: ' + rootGetters['chain/getBlockHeight']
  },
  mutations: {
    ...getMutationsFromManagers(managers),
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setSubscription: (state, subscription) => { state.subscription = subscription },
    currentBlockHeight: (state, currentBlockHeight) => Vue.set(state, 'currentBlockHeight', currentBlockHeight),
  },
  actions: {
    ...getActionsFromManagers(managers),
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
    async subscribe({ commit, getters, rootGetters }) {
      if (getters.getSubscription === null) {
        const subscription = await sdkListener.subscribeNewBlock(getters.timeline.addLatestItem, rootGetters['api/wsEndpoint'])
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


    // Fetch data from the SDK and initialize the page.
    async initializePage(context) {
      await context.getters.timeline.setStore(context).initialFetch();
    },

    getBlockInfo: async (context, height) => {
      context.commit('currentBlockHeight', height)
      await context.getters.info.setStore(context).initialFetch(height);
    },

    nextBlock: ({ commit, getters, dispatch, rootGetters }) => {
      if (getters.currentBlockHeight < rootGetters['chain/getBlockHeight']) {
        dispatch('ui/openPage', {
          pageName: 'block',
          param: +getters.currentBlockHeight + 1
        }, { root: true })
      }
    },
    
    previousBlock: ({ commit, getters, dispatch }) => {
      if (+getters.currentBlockHeight > 1) {
        dispatch('ui/openPage', {
          pageName: 'block',
          param: +getters.currentBlockHeight - 1
        }, { root: true })
      }
    }
  }
}
