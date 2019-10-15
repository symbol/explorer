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

import sdkNamespace from '../infrastructure/getNamespace'

export default {
  namespaced: true,
  state: {
    // The Namespace detail infomation.
    namespaceInfo: {},
    // The Namespace Level.
    namespaceLevels: []
  },
  getters: {
    getNamespaceInfo(state) {
      return state.namespaceInfo
    },
    getNamespaceLevels(state) {
      return state.namespaceLevels
    }
  },
  mutations: {
    setNamespaceInfo(state, namespaceInfo) {
      state.namespaceInfo = namespaceInfo
    },
    setNamespaceLevels(state, namespaceLevels) {
      state.namespaceLevels = namespaceLevels
    }
  },
  actions: {
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
          parentId: parentId === '' ? 'NO AVAILABLE' : parentId.toHex()
        }
        namespaceLevels.push(namespaceLevelObject)
      })
      commit('setNamespaceLevels', namespaceLevels)
    }
  }
}
