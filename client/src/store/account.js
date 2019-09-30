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

import sdkAccount from '../infrastructure/getAccount'
import sdkTransaction from '../infrastructure/getTransaction'
import sdkNamespace from '../infrastructure/getNamespace'


export default {
  namespaced: true,
  state: {
    // The Account detail infomation.
    accountInfo: {},
    // The Account Holding mosaics.
    accountBalance: [],
    // The Account Created namespace.
    accountOwnNamespaces: [],
    // The Account Created mosaic.
    accountCreatedMosaics: [], // Wait for Rest team apply
    // The Account Transactions list.
    accountTransactions: []
  },
  getters: {
    getAccountInfo(state) {
      return state.accountInfo
    },
    getAccountBalance(state) {
      return state.accountBalance
    },
    getAccountOwnNamespaces(state) {
      return state.accountOwnNamespaces
    },
    getAccountCreatedMosaics(state) {
      return state.accountOwnNamespaces
    },
    getAccountTransactions(state) {
      return state.accountTransactions
    }
  },
  mutations: {
    setAccountInfo(state, accountInfo) {
      state.accountInfo = accountInfo
    },
    setAccountBalance(state, accountBalance) {
      state.accountBalance = accountBalance
    },
    setAccountOwnNamespaces(state, accountOwnNamespaces) {
      state.accountOwnNamespaces = accountOwnNamespaces
    },
    setAccountCreatedMosaics(state, accountCreatedMosaics) {
      state.accountCreatedMosaics = accountCreatedMosaics
    },
    setAccountTransactions(state, accountTransactions) {
      state.accountTransactions = accountTransactions
    }
  },
  actions: {
    // Fetch data from the SDK By Address.
    async fetchAccountDataByAddress({ commit }, address) {
      let accountInfo = await sdkAccount.getAccountInfoByAddress(address)
      commit('setAccountInfo', accountInfo)

      let accountBalance = []
      accountInfo.mosaics.forEach((el, idx) => {
        let mosaicLink = `<a href="#/mosaic/${el.id}">${el.id}</a>`
        let balanceObject = {
          idx : idx+1,
          mosaicId: mosaicLink,
          amount: el.amount
        }
        accountBalance.push(balanceObject)
      })
      commit('setAccountBalance', accountBalance)

      const transactionList = await sdkTransaction.getAccountTransactions(address)

      let accountTransactions = []
      transactionList.forEach((el, idx) => {
        let transactionLink = `<a href="#/transaction/${el.transactionHash}">${el.transactionHash}</a>`
        let transactionObject = {
          idx : idx+1,
          deadline: el.deadline,
          fee: el.fee,
          transactionHash: transactionLink,
          transactionType: el.transactionBody.type
        }
        accountTransactions.push(transactionObject)
      })
      commit('setAccountTransactions', accountTransactions)

      const ownedNamespaceList = await sdkNamespace.getNamespacesFromAccountByAddress(address)

      let ownedNamespaces = []
      ownedNamespaceList.forEach((el, idx) => {
        let namespaceNameLink = `<a href="/#/namespace/${el.namespaceName}">${el.namespaceName}</a>`
        let ownedNamespaceObject = {
          idx : idx+1,
          namespaceName: namespaceNameLink,
          namespaceType: el.type,
          status: el.active,
          namespaceStartHeight: el.startHeight,
          namespaceEndHeight: el.endHeight
        }
        ownedNamespaces.push(ownedNamespaceObject)
      })
      commit('setAccountOwnNamespaces', ownedNamespaces)
    }
  }
}
