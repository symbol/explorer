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
    },
  },
  mutations: {
    setNamespaceInfo(state, namespaceInfo) {
      state.namespaceInfo = namespaceInfo
    },
    setNamespaceLevels(state, namespaceLevels) {
      state.namespaceLevels = namespaceLevels
    },
  },
  actions: {
    // Fetch data from the SDK.
    async fetchNamespaceInfo({ commit }, namespaceOrHex) {
      let namespaceInfo = await sdkNamespace.getNamespaceInfo(namespaceOrHex)

      let namespaceInfoObject = {
        'Owner Address': namespaceInfo.owner,
        'Name': namespaceInfo.namespaceName,
        'Namespace ID': namespaceInfo.namespaceNameHexId,
        'Registration Type': namespaceInfo.registrationType,
        'Start Height': namespaceInfo.startHeight,
        'End Height': namespaceInfo.endHeight,
        'Active': namespaceInfo.active,
        'Alias': namespaceInfo.alias,
      }
      commit('setNamespaceInfo', namespaceInfoObject)

      let namespaceLevels = []
      namespaceInfo.levels.forEach((el) => {
        let namespaceLevelObject = {
          name: "nem",
          'Namespace ID': el.namespaceId.toHex(),
          'Parent ID': el.parentId.toHex()
        }
        namespaceLevels.push(namespaceLevelObject)
      })
      commit('setNamespaceLevels', namespaceLevels)

    }
  }
}
