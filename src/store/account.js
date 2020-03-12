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
import Constants from '../config/constants'
import sdkAccount from '../infrastructure/getAccount'
import { 
  Filter, 
  DataSet, 
  Timeline, 
  getStateFromManagers,
  getGettersFromManagers,
  getMutationsFromManagers,
  getActionsFromManagers
} from './manager'

const managers = [
  new Timeline(
    'harvester',
    () => sdkAccount.getAccountsFromAddressWithLimit(Constants.PageSize, 'harvested/blocks'),
    (key, pageSize) => sdkAccount.getAccountsFromAddressWithLimit(pageSize, 'harvested/blocks', key),
    'address'
  ),
  new Timeline(
    'rich',
    () => sdkAccount.getAccountsFromAddressWithLimit(Constants.PageSize, 'balance/xym'),
    (key, pageSize) => sdkAccount.getAccountsFromAddressWithLimit(pageSize, 'balance/xym', key),
    'address'
  ),
  new Filter(
    'timeline',
    {
      'harvester': 'Harvester List',
      'rich': 'Rich List'
    }
  ),
  new DataSet(
    'info',
    (address) => sdkAccount.getAccountInfoByAddressFormatted(address)
  ),

  // TODO OlegMakarenko: Add `getAccountTransactions` method to `infratructure.getAccount`
  // new Timeline(
  //   'all',
  //   (pageSize, store) => sdkAccount.getAccountTransactions(pageSize, null, store.getters.currentAccountAddress),
  //   (key, pageSize) => sdkAccount.getAccountTransactions(pageSize, null, store.getters.currentAccountAddress, key),
  //   'transactionHash',
  //   10
  // ),
  // new Timeline(
  //   'mosaic',
  //   (pageSize, store) => sdkAccount.getAccountTransactions(pageSize, 'mosaic', store.getters.currentAccountAddress),
  //   (key, pageSize) => sdkAccount.getAccountTransactions(pageSize, 'mosaic', store.getters.currentAccountAddress, key),
  //   'transactionHash',
  //   10
  // ),
  // new Timeline(
  //   'namespace',
  //   (pageSize, store) => sdkAccount.getAccountTransactions(pageSize, 'namespace', store.getters.currentAccountAddress),
  //   (key, pageSize) => sdkAccount.getAccountTransactions(pageSize, 'namespace', store.getters.currentAccountAddress, key),
  //   'transactionHash',
  //   10
  // ),
  // new Timeline(
  //   'transfer',
  //   (pageSize, store) => sdkAccount.getAccountTransactions(pageSize, 'transfer', store.getters.currentAccountAddress),
  //   (key, pageSize) => sdkAccount.getAccountTransactions(pageSize, 'transfer', store.getters.currentAccountAddress, key),
  //   'transactionHash',
  //   10
  // ),
  // new Filter(
  //   'transactions',
  //   {
  //     all: 'All transactions',
  //     mosaic: 'Mosaic transactions',
  //     namespace: 'Namespace transactions',
  //     transfer: 'Transfers'
  //   }
  // )
]

const LOCK = Lock.create()

const TIMELINES = {
  // Rich list.
  // rich: Timeline.empty(),
  // Harvester list.
  harvester: Timeline.empty()
}

// Map the timeline name to the account filter type.
const ACCOUNT_TYPE_MAP = {
  // rich: 'balance/xem',
  harvester: 'harvested/blocks'
}

export default {
  namespaced: true,
  state: {
    ...getStateFromManagers(managers),
    // If the state has been initialized.
    initialized: false
  },
  getters: {
    ...getGettersFromManagers(managers),
    getInitialized: state => state.initialized,
    getAccountInfo: state => state.info?.data.accountInfo || {},
    getAccountMultisig: state => state.info?.data.accountMultisig || {},
    getAccountMultisigCosignatories: state => state.info?.data.accountMultisigCosignatories || [],
    getNamespaceList: state => state.info?.data.namespaceList || [],
    getMosaicList: state => state.info?.data.mosaicList || [],
    getAccountRestrictionList: state => state.info?.data.accountRestrictionList || [],
    getTransactionList: state => state.info?.data.transactionList || [],
    getActivityBucketList: state => state.info?.data.activityBucketList || [],
    getMetadataList: state => state.info?.data.metadataList || []
  },
  mutations: {
    ...getMutationsFromManagers(managers),
    setInitialized: (state, initialized) => { state.initialized = initialized }
  },
  actions: {
    ...getActionsFromManagers(managers),
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
    async initializePage(context) {
      await context.getters.harvester.setStore(context);
      await context.getters.rich.setStore(context);
      await context.getters.timeline.setStore(context).initialFetch();
    },

    // Fetch data from the SDK By Address.
    async fetchAccountDataByAddress(context, address) {
      await context.getters.info.setStore(context).initialFetch(address);
    }
  }
}
