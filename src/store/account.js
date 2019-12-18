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

import Lock from './lock'
import Timeline from './timeline'
import Constants from '../config/constants'
import sdkAccount from '../infrastructure/getAccount'

const LOCK = Lock.create()

const TIMELINES = {
  // Rich list.
  rich: Timeline.empty(),
  // Harvester list.
  harvester: Timeline.empty()
}

// Map the timeline name to the account filter type.
const ACCOUNT_TYPE_MAP = {
  rich: 'balance/xem',
  harvester: 'harvested/blocks'
}

export default {
  namespaced: true,
  state: {
    // If the state has been initialized.
    initialized: false,
    // The current account type key, as defined in `TIMELINES`.
    accountType: 'rich',
    ...TIMELINES,
    // Determine if the accounts model is loading.
    loading: false,
    // Determine if the accounts model has an error.
    error: {
      rich: false,
      harvester: false
    },
    // The Account detail information.
    accountInfo: {},
    // The Account Multisig Information.
    accountMultisig: {},
    accountMultisigCosignatories: [],
    // The Account Created namespace.
    namespaceList: [],
    // The Account Holding mosaics.
    mosaicList: [],
    // The Account Transactions list.
    transactionList: [],
    // The Account Activity Bucket.
    activityBucketList: [],
    // The Account Metadata list.
    metadataList: [],
    // The Account Created mosaic.
    createdMosaics: [], // Wait for Rest team apply,
    accountInfoLoading: false,
    accountInfoError: false
  },
  getters: {
    getInitialized: state => state.initialized,
    getAccountType: state => state.accountType,
    getTimeline: state => state[state.accountType],
    getCanFetchPrevious: (state, getters) => getters.getTimeline.canFetchPrevious,
    getCanFetchNext: (state, getters) => getters.getTimeline.canFetchNext,
    getTimelineList: (state, getters) => getters.getTimeline.current,
    getTimelineFormatted: (state, getters) => getters.getTimeline.current.map(el => ({
      address: el.address.plain(),
      // TODO(ahuszagh) Need balance....
      lastActivity: el.lastActivity,
      importance: el.importance,
      info: el.accountAliasName || ''
    })),
    getLoading: state => state.loading,
    getAccountInfo: state => state.accountInfo,
    getAccountMultisig: state => state.accountMultisig,
    getAccountMultisigCosignatories: state => state.accountMultisigCosignatories,
    getNamespaceList: state => state.namespaceList,
    getMosaicList: state => state.mosaicList,
    getTransactionList: state => state.transactionList,
    getActivityBucketList: state => state.activityBucketList,
    getMetadataList: state => state.metadataList,
    getError: state => state.error[state.accountType],
    accountInfoLoading: state => state.accountInfoLoading,
    accountInfoError: state => state.accountInfoError,
    filterValue: state => state.accountType,
    filterOptions: () => ({
      'rich': 'Rich List',
      'harvester': 'Harvester List'
    })
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setAccountType: (state, accountType) => { state.accountType = accountType },
    setTimeline: (state, timeline) => { state[state.accountType] = timeline },
    setTimelineWithType: (state, { timeline, type }) => { state[type] = timeline },
    setLoading: (state, loading) => { state.loading = loading },
    setAccountInfo: (state, accountInfo) => { state.accountInfo = accountInfo },
    setAccountMultisig: (state, accountMultisig) => { state.accountMultisig = accountMultisig },
    setAccountMultisigCosignatories: (state, accountMultisigCosignatories) => { state.accountMultisigCosignatories = accountMultisigCosignatories },
    setNamespaceList: (state, namespaceList) => { state.namespaceList = namespaceList },
    setMosaicList: (state, mosaicList) => { state.mosaicList = mosaicList },
    setTransactionList: (state, transactionList) => { state.transactionList = transactionList },
    setActivityBucketList: (state, activityBucketList) => { state.activityBucketList = activityBucketList },
    setMetadataList: (state, metadataList) => { state.metadataList = metadataList },
    setError: (state, error) => { state.error[state.accountType] = error },
    setErrorWithType: (state, { error, type }) => { state.error[type] = error },
    accountInfoLoading: (state, v) => { state.accountInfoLoading = v },
    accountInfoError: (state, v) => { state.accountInfoError = v }
  },
  actions: {
    // Initialize the account model.
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('initializePage')
      }
      await LOCK.initialize(callback, commit, dispatch, getters)
    },

    // Uninitialize the account model.
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => { }
      await LOCK.uninitialize(callback, commit, dispatch, getters)
    },

    // Fetch data from the SDK and initialize the page.
    async initializePage({ commit, getters }) {
      commit('setLoading', true)
      for (let accountType of Object.keys(TIMELINES)) {
        const type = ACCOUNT_TYPE_MAP[accountType]
        try {
          let data = await sdkAccount.getAccountsFromAddressWithLimit(2 * Constants.PageSize, type)
          commit('setTimelineWithType', { timeline: Timeline.fromData(data), type: accountType })
        } catch (e) {
          console.error(e)
          commit('setErrorWithType', { error: true, type: accountType })
        }
      }
      commit('setLoading', false)
    },

    // Fetch the next page of data.
    async fetchNextPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.next
      try {
        if (list.length === 0) {
          throw new Error('internal error: next list is 0.')
        }
        const account = list[list.length - 1]
        const type = ACCOUNT_TYPE_MAP[getters.getAccountType]
        const fetchNext = pageSize => sdkAccount.getAccountsFromAddressWithLimit(pageSize, type, account.address)
        commit('setTimeline', await timeline.shiftNext(fetchNext))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Fetch the previous page of data.
    async fetchPreviousPage({ commit, getters }) {
      commit('setLoading', true)
      const timeline = getters.getTimeline
      const list = timeline.previous
      try {
        if (list.length === 0) {
          throw new Error('internal error: previous list is 0.')
        }
        const account = list[0]
        const type = ACCOUNT_TYPE_MAP[getters.getAccountType]
        const fetchPrevious = pageSize => sdkAccount.getAccountsSinceAddressWithLimit(pageSize, type, account.address)
        const fetchLive = pageSize => sdkAccount.getAccountsFromAddressWithLimit(pageSize, type)
        commit('setTimeline', await timeline.shiftPrevious(fetchPrevious, fetchLive))
      } catch (e) {
        console.error(e)
        commit('setError', true)
      }
      commit('setLoading', false)
    },

    // Change the current page.
    async changePage({ commit, getters }, accountType) {
      commit('setLoading', true)
      if (getters.getAccountType !== accountType) {
        try {
          if (!getters.getTimeline.isLive) {
            // Reset to the live page.
            const type = ACCOUNT_TYPE_MAP[getters.getAccountType]
            let data = await sdkAccount.getAccountsFromAddressWithLimit(2 * Constants.PageSize, type)
            commit('setTimeline', Timeline.fromData(data))
          }
        } catch (e) {
          console.error(e)
          commit('setError', true)
        }
        commit('setAccountType', accountType)
      }
      commit('setLoading', false)
    },

    // Reset the current page type and page index.
    async resetPage({ commit, getters }) {
      commit('setLoading', true)
      if (getters.getAccountType !== 'rich') {
        try {
          if (!getters.getTimeline.isLive) {
            // Reset to the live page.
            const type = ACCOUNT_TYPE_MAP[getters.getAccountType]
            let data = await sdkAccount.getAccountsFromAddressWithLimit(2 * Constants.PageSize, type)
            commit('setTimeline', Timeline.fromData(data))
          }
        } catch (e) {
          console.error(e)
          commit('setError', true)
        }
        commit('setAccountType', 'rich')
      }
      commit('setLoading', false)
    },

    // Fetch data from the SDK By Address.
    async fetchAccountDataByAddress({ commit }, address) {
      // Loading start
      commit('accountInfoLoading', true)
      // Clear data
      commit('accountInfoError', false)
      commit('setAccountInfo', {})
      commit('setAccountMultisig', {})
      commit('setMosaicList', [])
      commit('setTransactionList', [])
      commit('setNamespaceList', [])
      commit('setAccountMultisigCosignatories', [])
      commit('setActivityBucketList', [])
      commit('setMetadataList', [])

      // Fetch account info from SDK
      let accountInfo
      try { accountInfo = await sdkAccount.getAccountInfoByAddressFormatted(address) } catch (e) {
        console.error(e)
        commit('accountInfoError', true)
      }

      // Commit data to the Store
      if (accountInfo) {
        commit('setAccountInfo', accountInfo.accountInfo)
        commit('setMosaicList', accountInfo.mosaicList)
        commit('setAccountMultisig', accountInfo.multisigInfo)
        commit('setAccountMultisigCosignatories', accountInfo.multisigCosignatoriesList)
        commit('setTransactionList', accountInfo.tansactionList)
        commit('setNamespaceList', accountInfo.namespaceList)
        commit('setActivityBucketList', accountInfo.activityBuckets)
        commit('setMetadataList', accountInfo.metadataList)
      }

      // Loading end
      commit('accountInfoLoading', false)
    }
  }
}
