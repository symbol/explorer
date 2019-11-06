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
import sdkAccount from '../infrastructure/getAccount'

const LOCK = Lock.create()

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // The Account detail information.
    accountInfo: {},
    // The Account Multisig Information.
    accountMultisig: {},
    accountMultisigCosignatories: [],
    // The Account Created namespace.
    namespaceList: [],
    // The Account Holding mosaics.
    mosaicList: [],
    // The Account Transactions list.
    transactionList: [],
    // The Account Created mosaic.
    createdMosaics: [], // Wait for Rest team apply
    accountInfoLoading: false,
    accountInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    accountInfo: state => state.accountInfo,
    accountMultisig: state => state.accountMultisig,
    accountMultisigCosignatories: state => state.accountMultisigCosignatories,
    namespaceList: state => state.namespaceList,
    mosaicList: state => state.mosaicList,
    transactionList: state => state.transactionList,
    accountInfoLoading: state => state.accountInfoLoading,
    accountInfoError: state => state.accountInfoError
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    accountInfo: (state, payload) => Vue.set(state, 'accountInfo', payload),
    accountMultisig: (state, payload) => Vue.set(state, 'accountMultisig', payload),
    accountMultisigCosignatories: (state, payload) => Vue.set(state, 'accountMultisigCosignatories', payload),
    namespaceList: (state, payload) => Vue.set(state, 'namespaceList', payload),
    mosaicList: (state, payload) => Vue.set(state, 'mosaicList', payload),
    transactionList: (state, payload) => Vue.set(state, 'transactionList', payload),
    accountInfoLoading: (state, payload) => Vue.set(state, 'accountInfoLoading', payload),
    accountInfoError: (state, payload) => Vue.set(state, 'accountInfoError', payload)
  },
  actions: {
    // Initialize the account model.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {}
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the account model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {}
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Fetch data from the SDK By Address.
    async fetchAccountDataByAddress({ commit }, address) {
      // Loading start
      commit('accountInfoLoading', true)
      // Clear data
      commit('accountInfoError', false)
      commit('accountInfo', {})
      commit('accountMultisig', {})
      commit('mosaicList', [])
      commit('transactionList', [])
      commit('namespaceList', [])
      commit('accountMultisigCosignatories', [])

      // Fetch account info from SDK
      let accountInfo
      try { accountInfo = await sdkAccount.getAccountInfoByAddressFormatted(address) } catch (e) {
        console.error(e)
        commit('accountInfoError', true)
      }

      // Commit data to the Store
      if (accountInfo) {
        commit('accountInfo', accountInfo.accountInfo)
        commit('mosaicList', accountInfo.mosaicList)
        commit('accountMultisig', accountInfo.multisigInfo)
        commit('accountMultisigCosignatories', accountInfo.multisigCosignatoriesList)
        commit('transactionList', accountInfo.tansactionList)
        commit('namespaceList', accountInfo.namespaceList)
      }

      // Loading end
      commit('accountInfoLoading', false)
    }
  }
}
