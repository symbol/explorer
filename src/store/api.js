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
import helper from '../helper'
import router from '../router'
import http from '../infrastructure/http'

const LOCK = Lock.create()

export default {
  namespaced: true,

  state: {
    // If the global state has been initialized.
    initialized: false,
    nodes: [...PEERS_API.nodes],
    defaultNode: helper.parseUrl(PEERS_API.defaultNode),
    currentNode: helper.parseUrl(PEERS_API.defaultNode),
    wsEndpoint: PEERS_API.defaultNode |> helper.httpToWsUrl,
    marketData: helper.parseUrl(ENDPOINTS.MARKET_DATA)
  },

  getters: {
    getInitialized: state => state.initialized,
    nodes: state =>
      Array.isArray(state.nodes)
        ? state.nodes.map(node => helper.parseUrl(node))
        : [],
    currentNode: state => state.currentNode.toString(),
    currentNodeHostname: state => state.currentNode.hostname,
    wsEndpoint: state => state.wsEndpoint.toString(),
    marketData: state => state.marketData.toString()
  },

  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    mutate: (state, { key, value }) => Vue.set(state, key, value),
    currentNode: (state, payload) => {
      if (undefined !== payload) {
        let currentNode = helper.parseUrl(payload)
        let wsEndpoint = currentNode.toString() |> helper.httpToWsUrl
        Vue.set(state, 'currentNode', currentNode)
        Vue.set(state, 'wsEndpoint', wsEndpoint)
      }
    }
  },

  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        const nodeUrl = getters['currentNode']
        const marketDataUrl = getters['marketData']
        http.init(nodeUrl, marketDataUrl)
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    async changeNode({ commit, dispatch }, currentNodeUrl) {
      if (helper.validURL(currentNodeUrl)) {
        // Set the current node URL.
        commit('currentNode', currentNodeUrl)
        localStorage.setItem('currentNodeUrl', currentNodeUrl)
        // Uninitialize the data and re-initialize the API.
        await dispatch('uninitialize', null, { root: true })
        await dispatch('initialize', router.currentRoute, { root: true })
      } else {
        throw Error('Cannot change node. URL is not valid: ' + currentNodeUrl)
      }
    }
  }
}
