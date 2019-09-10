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
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blockList: Array,
    chainStatus: {
      currentBlockHeight: Number,
    }

  },
  getters: {
    getCurrentBlockHeight(state) {
      return state.chainStatus.currentBlockHeight;
    },
    getLatestBlockList(state) {
      return state.blockList;
    }
  },
  mutations: {
    setLatestChainStatus(state, block) {
      state.chainStatus.currentBlockHeight = block.height;
    },
    addBlock(state, formattedBlock) {
      if (state.blockList.length >= 25) state.blockList.pop();
      state.blockList.unshift(formattedBlock);
    },
    setBlockList(state, blocklist) {
      state.blockList = blocklist
    }
  },
  actions: {
    ADD_BLOCK({ commit, dispatch, state }, block) {
      dispatch('SET_LATEST_CHAIN_STATUS', block);
      commit('addBlock', block);
    },
    SET_LATEST_CHAIN_STATUS({ commit }, block) {
      commit('setLatestChainStatus', block);
    },
    SET_BLOCKS_LIST({ commit }, blocklist) {
      commit('setBlockList', blocklist);
    },
  }
})
