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

import sdkDiagnostic from '../infrastructure/getDiagnostic'
import apiMarketData from '../infrastructure/getMarketData'

export default {
  namespaced: true,
  state: {
    // The current block height.
    blockHeight: 0,
    // The latest transaction hash.
    transactionHash: '',
    // The chain info.
    chainInfo: {
      // The total transactions.
      numTransactions: 0,
      // The total Accounts.
      numAccounts: 0
    },
    // The Market Data.
    marketData: {
      marketCap: 0,
      price: 0,
      historicalHourlyGraph: {}
    }
  },
  getters: {
    getBlockHeight(state) {
      return state.blockHeight
    },
    getTransactionHash(state) {
      return state.transactionHash
    },
    getChainInfo(state) {
      return state.chainInfo
    },
    getMarketData(state) {
      return state.marketData
    }
  },
  mutations: {
    setBlockHeight(state, blockHeight) {
      state.blockHeight = blockHeight
    },
    setTransactionHash(state, transactionHash) {
      state.transactionHash = transactionHash
    },
    setChainInfo(state, chainInfo) {
      state.chainInfo.numTransactions = chainInfo.numTransactions
      state.chainInfo.numAccounts = chainInfo.numAccounts
    },
    setMarketData(state, { marketData, graphData }) {
      state.marketData.price = marketData.XEM.USD.PRICE
      state.marketData.marketCap = marketData.XEM.USD.MKTCAP
      state.marketData.historicalHourlyGraph = graphData
    }
  },
  actions: {
    // Initialize the chain model.
    async initialize({ dispatch }) {
      await dispatch('initializePage')
    },

    // Set node url to SDK
    initializeSdk({rootGetters}) {
      sdkDiagnostic.init(rootGetters['api/currentNode'].url)
      apiMarketData.init(rootGetters['api/currentNode'].url)
    },

    // Fetch data from the SDK / API and initialize the page.
    async initializePage({ commit }) {
      let chainInfo = await sdkDiagnostic.getChainInfo()
      commit('setChainInfo', chainInfo)

      let marketData = await apiMarketData.getXemPriceData()
      let xemGraph = await apiMarketData.getXemHistoricalHourlyGraph()

      let graphData = []
      if (xemGraph) {
        xemGraph.Data.map((item, index) => {
          let graphDataItem = {}
          graphDataItem.y = []
          graphDataItem.x = new Date(item['time'] * 1000)
          graphDataItem.y[0] = item['open'] // parseFloat(item['open']).toFixed(4)
          graphDataItem.y[1] = item['high'] // parseFloat(item['high']).toFixed(4)
          graphDataItem.y[2] = item['low'] // parseFloat(item['low']).toFixed(4)
          graphDataItem.y[3] = item['close'] // parseFloat(item['close']).toFixed(4)
          graphData.push(graphDataItem)
        })
      }
      commit('setMarketData', { marketData, graphData })
    }
  }
}
