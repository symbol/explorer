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

import sdkMosaic from '../infrastructure/getMosaic'

export default {
  namespaced: true,
  state: {
    // The Mosaic detail infomation.
    mosaicInfo: {},
  },
  getters: {
    getMosaicInfo(state) {
      return state.mosaicInfo
    },
  },
  mutations: {
    setMosaicInfo(state, mosaicInfo) {
      state.mosaicInfo = mosaicInfo
    },
  },
  actions: {
    // Fetch data from the SDK.
    async fetchMosaicInfo({ commit }, mosaicHexOrNamespace) {
      let mosaicInfo = await sdkMosaic.getMosaicInfo(mosaicHexOrNamespace)

      let mosaicInfoObject = {
        'Mosaic': mosaicInfo.mosaic,
        'Namespace': mosaicInfo.namespace,
        'Divisibility': mosaicInfo.divisibility,
        'Owner Address': mosaicInfo.address,
        'Supply': mosaicInfo.supply,
        'Revision': mosaicInfo.revision,
        'Start Height': mosaicInfo.startHeight,
        'Duration': mosaicInfo.duration,
        'SupplyMutable': mosaicInfo.supplyMutable,
        'Transferable': mosaicInfo.transferable,
        'Restrictable': mosaicInfo.restrictable
      }
      commit('setMosaicInfo', mosaicInfoObject)
    }
  }
}
