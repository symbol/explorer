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
import router from '../router'
import { Address, AccountHttp } from 'nem2-sdk'
import { i18n } from '../config'

export default {
  namespaced: true,
  state: {
    languages: i18n.languages,
    currentLanguage: localStorage.getItem('userLanguage'),
    keyNames: {}, /// put new names here => src/config/i18n/en-us.json

    keyPages: {
      'height': 'block',

      'harvester': 'account',
      'address': 'account',
      'signer': 'account',
      'recipient': 'account',
      'owneraddress': 'account',
      'linkedAccountKey': 'account',
      'remoteAccountAddress': 'account',

      'transactionHash': 'transaction',
      'mosaicId': 'mosaic',

      'addressHeight': 'block',
      'publicKeyHeight': 'block',
      'importanceHeight': 'block',
      'blockHeight': 'block',
      'startHeight': 'block',
      'endHeight': 'block',
      'lastActivity': 'block',

      'namespaceName': 'namespace',
      'namespaceId': 'namespace',
      'parentId': 'namespace',
      'linkedNamespace': 'namespace',
    }
  },

  getters: {
    getNameByKey: state => key => i18n.getName(key),
    languages: state => state.languages,
    currentLanguage: state => state.currentLanguage,
    getPageHref: state => payload => {
      if (payload.pageName);
      {
        let key = payload.pageName
        let pageName = state.keyPages[key] || key
        let value = payload.param

        if (value != null)
          return `/${pageName}/${value}`
        else
          return `/${pageName}`
      }
    }
  },

  mutations: {

  },
  actions: {
    openPage: ({ state }, payload) => {
      if (payload.pageName);
      {
        let key = payload.pageName
        let pageName = state.keyPages[key] || key
        let value = payload.param

        if (value != null)
          router.push({ path: `/${pageName}/${value}` })
        else
          router.push({ path: `/${pageName}` })
      }
    },

    search: ({ dispatch, rootGetters }, searchString) => {
      return new Promise(async (resolve, reject) => {
        if (searchString !== null && searchString !== '') {
          searchString = searchString.replace(/[^a-zA-Z0-9]/g, '')
          if (isBlockHeight(searchString)) {
            dispatch('openPage', {
              pageName: 'block',
              param: searchString
            })
            resolve()
          } else
          if (isTransactionId(searchString)) {
            reject(new Error('Search by tx id is not supported yet..'))
            // dispatch('openPage', {
            //     pageName: 'transaction',
            //     param: searchString
            // });
          } else
          if (isAccountPublicKey(searchString)) {
            // check the string is a public key of an account

            const api = rootGetters['api/currentNode'].url
            let accountHttp = new AccountHttp(api)
            let accountAddress
            let accountInfo
            try {
              accountInfo = await accountHttp
                .getAccountInfo(new Address(searchString))
                .toPromise()
              accountAddress = accountInfo.address.address
            } catch (e) { }
            if (accountAddress) {
              dispatch('openPage', {
                pageName: 'account',
                param: accountAddress
              })
              resolve()
            } else {
              // transaction hash
              dispatch('openPage', {
                pageName: 'transaction',
                param: searchString
              })
              resolve()
            }
          } else
          if (isAccountAddress(searchString)) {
            dispatch('openPage', {
              pageName: 'account',
              param: searchString
            })
            resolve()
          } else {
            reject(new Error('Nothing found..'))
          }
        } else {
          reject(new Error('Nothing found..'))
        }
      })
    },

    changeLanguage: ({ state }, language) => {
      if (language !== null &&
        language !== void 0) {
        i18n.setCurrentLanguage(language)
      } else { throw Error('Cannot change language. language is not supported: ' + language) }
    }
  }
}

const isTransactionId = (str) =>
  str.length === 24

const isAccountPublicKey = (str) =>
  str.length === 64 &&
  str.match('^[A-z0-9]+$')

const isAccountAddress = (str) =>
  str.length === 40 &&
  str.match('^[A-z0-9]+$') &&
  (str.substring(0, 1) === 'S' || str.substring(0, 1) === 's')

const isBlockHeight = (str) =>
  str.match(/^-{0,1}\d+$/)
