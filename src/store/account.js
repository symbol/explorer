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
import sdkAccount from '../infrastructure/getAccount'
import sdkTransaction from '../infrastructure/getTransaction'
import sdkNamespace from '../infrastructure/getNamespace'

export default {
  namespaced: true,
  state: {
    // The Account detail infomation.
    accountInfo: {},
    // The Account Multisig Infomation.
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
    async initialize({ dispatch }) {
      dispatch('initializeSdk')
    },

    // Set node url to SDK
    initializeSdk({ rootGetters }) {
      sdkAccount.init(rootGetters['api/currentNode'].url)
      sdkTransaction.init(rootGetters['api/currentNode'].url)
      sdkNamespace.init(rootGetters['api/currentNode'].url)
    },

    // Fetch data from the SDK By Address.
    async fetchAccountDataByAddress({ commit }, address) {
      commit('accountInfoLoading', true)
      commit('accountInfoError', false)
      commit('accountInfo', {})
      commit('accountMultisig', {})
      commit('mosaicList', [])
      commit('transactionList', [])
      commit('namespaceList', [])
      commit('accountMultisigCosignatories', [])

      let accountInfo

      try {
        accountInfo = await sdkAccount.getAccountInfoByAddress(address)
      } catch (e) {
        console.error(e)
        commit('accountInfoError', true)
      }

      if (accountInfo) {
        let formattedAccountInfo = {
          address: accountInfo.address.address,
          linkedNamespace: accountInfo.accountAliasName,
          addressHeight: accountInfo.addressHeight,
          publicKey: accountInfo.publicKey,
          // publicKeyHeight: accountInfo.publicKeyHeight,
          importance: accountInfo.importance,
          // importanceHeight: accountInfo.importanceHeight,
          accountType: accountInfo.accountType,
          linkedAccountKey: accountInfo.linkedAccountKey
        }
        let mosaicList = Array.isArray(accountInfo.mosaics)
          ? accountInfo.mosaics.map(el => ({
            mosaicId: el.id,
            amount: el.amount
          }))
          : []

        commit('accountInfo', formattedAccountInfo)
        commit('mosaicList', mosaicList)
      }

      let accountMultisig
      try {
        accountMultisig = await sdkAccount.getMultisigAccountByAddress(address)
      } catch (e) {
        console.error(e)
      }

      if (accountMultisig) {
        let formattedAccountMultisig = {
          minApproval: accountMultisig.minApproval,
          minRemoval: accountMultisig.minRemoval
        }

        commit('accountMultisig', formattedAccountMultisig)
        commit('accountMultisigCosignatories', accountMultisig.cosignatories)
      }

      let transactionList

      try {
        transactionList = await sdkTransaction.getAccountTransactions(address)
      } catch (e) {
        console.error(e)
        // commit('accountInfoError', true);
      }

      let formattedTansactionList = []
      if (transactionList) {
        formattedTansactionList = transactionList.map(el => ({
          deadline: el.deadline,
          fee: el.fee,
          transactionHash: el.transactionHash,
          transactionType: el.transactionBody.type
        }))
      }

      commit('transactionList', formattedTansactionList)

      let namespaceList
      try {
        namespaceList = await sdkNamespace.getNamespacesFromAccountByAddress(address)
      } catch (e) {
        console.error(e)
        // commit('accountInfoError', true)
      }

      let formattedNamespaceList = []
      if (namespaceList) {
        formattedNamespaceList = namespaceList.map(
          el => ({
            namespaceName: el.namespaceName,
            registrationType: el.type,
            status: el.active,
            startHeight: el.startHeight,
            endHeight: el.endHeight
          })
        )
      }
      commit('namespaceList', formattedNamespaceList)
      commit('accountInfoLoading', false)
    }
  }
}
