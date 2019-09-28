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

import block from './block'
import chain from './chain'
import transaction from './transaction'
import ui from './ui'
import account from './account'
import mosaic from './mosaic'
import namespace from './namespace'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // Disable use-strict mode because it fails with the SDK listener.
  strict: false,
  modules: {
    block,
    chain,
    transaction,
    ui,
    account,
    mosaic,
    namespace
  },
  actions: {
    // Initialize the stores (call on app load).
    async initialize({ dispatch }) {
      await dispatch('block/initialize')
      await dispatch('transaction/initialize')
      await dispatch('chain/initialize')
    },

    // Uninitialize the stores (call on app destroyed).
    uninitialize({ dispatch }) {
      dispatch('block/uninitialize')
      dispatch('transaction/uninitialize')
    }
  }
})
