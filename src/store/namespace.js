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

import util from './util'
import sdkNamespace from '../infrastructure/getNamespace'
import Constants from '../config/constants'

export default {
  namespaced: true,
  state: {
    // Holds the PAGE_SIZE namespaces starting from current page.
    pageList: [],
    // The current page index (0-indexed).
    pageIndex: 0,
    // Determine if the namespaces model is loading.
    loading: false,
    // The Namespace detail infomation.
    namespaceInfo: {},
    // The Namespace Level.
    namespaceLevels: []
  },
  getters: {
    getPageList: state => state.pageList,
    getPageIndex: state => state.pageIndex,
    getLoading: state => state.loading,
    getPageListFormatted: (state, getters) => getters.getPageList.map(el => ({
      namespaceId: el.namespace,
      owneraddress: el.address,
      parentId: el.parent,
      startHeight: el.startHeight,
      depth: el.depth
    })),
    getNamespaceInfo: state => state.namespaceInfo,
    getNamespaceLevels: state => state.namespaceLevels
  },
  mutations: {
    setPageList: (state, list) => { state.pageList = list },
    setPageIndex: (state, pageIndex) => { state.pageIndex = pageIndex },
    setLoading: (state, loading) => { state.loading = loading },
    resetPageIndex: (state) => { state.pageIndex = 0 },
    setNamespaceInfo: (state, info) => { state.namespaceInfo = info },
    setNamespaceLevels: (state, levels) => { state.namespaceLevels = levels }
  },
  actions: {

    // Initialize the namespace model.
    // First fetch the page, then subscribe.
    async initialize({ dispatch }) {
      dispatch('initializeSdk')
      await dispatch('initializePage')
    },
      
      // Set node url to SDK
    initializeSdk({rootGetters}) {
      sdkNamespace.init(rootGetters['api/currentNode'].url)
    }

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit }) {
      commit('setLoading', true)
      let namespaceList = await sdkNamespace.getNamespacesFromIdWithLimit(util.PAGE_SIZE)
      commit('setPageList', namespaceList)
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageList.length > 0) {
        // Page is loaded, need to fetch next page.
        const namespace = pageList[pageList.length - 1]
        let namespaceList = await sdkNamespace.getNamespacesFromIdWithLimit(util.PAGE_SIZE, namespace.id)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', namespaceList)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const pageList = getters.getPageList
      const pageIndex = getters.getPageIndex
      if (pageList.length > 0) {
        // Page is loaded, need to fetch previous page.
        const namespace = pageList[0]
        let namespaceList = await sdkNamespace.getNamespacesSinceIdWithLimit(util.PAGE_SIZE, namespace.id)
        commit('setPageIndex', pageIndex + 1)
        commit('setPageList', namespaceList)
      }
      commit('setLoading', false)
    },

    // Reset the namespace page to the latest list (index 0)
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      const pageIndex = getters.getPageIndex
      if (pageIndex > 0) {
        let namespaceList = await sdkNamespace.getNamespacesFromIdWithLimit(util.PAGE_SIZE)
        commit('setPageIndex', 0)
        commit('setPageList', namespaceList)
      }
      commit('setLoading', false)
    },

    // Fetch data from the SDK.
    async fetchNamespaceInfo({ commit }, namespaceOrHex) {
      let namespaceInfo = await sdkNamespace.getNamespaceInfo(namespaceOrHex)

      let namespaceInfoObject = {
        owneraddress: namespaceInfo.owner,
        namespaceName: namespaceInfo.namespaceName,
        namespaceId: namespaceInfo.namespaceNameHexId,
        registrationType: namespaceInfo.registrationType,
        startHeight: namespaceInfo.startHeight,
        endHeight: namespaceInfo.endHeight,
        active: namespaceInfo.active,
        aliasType: namespaceInfo.aliasType,
        alias: namespaceInfo.alias
      }
      commit('setNamespaceInfo', namespaceInfoObject)

      let namespaceLevels = []
      namespaceInfo.levels.forEach((el) => {
        let parentId = el.parentId ? el.parentId : ''
        let namespaceLevelObject = {
          name: el.name,
          namespaceId: el.namespaceId,
          parentId: parentId === '' ? Constants.Message.UNAVAILABLE : parentId.toHex()
        }
        namespaceLevels.push(namespaceLevelObject)
      })
      commit('setNamespaceLevels', namespaceLevels)
    }
  }
}
