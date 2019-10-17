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
import { Endpoint } from '../config'

export default {
  namespaced: true,
  state: {
    keyNames: {
      'age': 'Age',
      'aliasAction': 'Alias Action',
      'linkAction': 'Link Action',
      'amount': 'Amount',
      'height': 'Height',
      'fee': 'Fee',
      'date': 'Date',
      'deadline': 'Deadline',
      'status': 'Status',
      'confirm': 'Confirmation',
      'signature': 'Signature',
      'harvester': 'Harvester',
      'datetime': 'Date',
      'difficulty': 'Difficulty',
      'address': 'Address',
      'account': 'Account',
      'block': 'Block',
      'mosaic': 'Mosaic',
      'namespace': 'Namespace',
      'namespaceName': 'Name',
      'transaction': 'Transaction',
      'transactionHash': 'Transaction Hash',
      'transactionId': 'Transaction ID',
      'totalTransactions': 'Total Transactions',
      'transactionType': 'Transaction Type',

      'addressHeight': 'Address height',
      'publicKey': 'Public key',
      'publicKeyHeight': 'PublicKey height',
      'importance': 'Importance',
      'importanceHeight': 'Importance height',
      'accountType': 'Account type',
      'linkedAccountKey': 'Linked account key',

      'accounts': 'Accounts',
      'blocks': 'Blocks',
      'mosaics': 'Mosaics',
      'namespaces': 'Namespaces',
      'namespaceId': 'Namespace ID',
      'depth': 'Depth',
      'transactions': 'Transactions',
      'mosaicId': 'Mosaic ID',

      'blockHeight': 'Block Height',
      'blockHash': 'Block Hash',
      'signer': 'Signer',
      'recipient': 'Recipient',
      'registrationType': 'Registration Type',
      'parentId': 'Parent ID',
      'duration': 'Duration',
      'remoteAccountPublicKey': 'Remote Account PublicKey',
      'remoteAccountAddress': 'Remote Account Address',
      'startHeight': 'Start Height',
      'endHeight': 'End Height',
      'divisibility': 'Divisibility',
      'supply': 'Supply',
      'owneraddress': 'Owner Address',
      'revision': 'Revision',
      'supplyMutable': 'Supply Mutable',
      'transferable': 'Transferable',
      'restrictable': 'Restrictable',
      'active': 'Active',
      'alias': 'Alias',
      'aliasType': 'Alias Type',
      'hashType': 'Hash Type',
      'secret': 'Secret',
      'linkedNamespace': 'Linked Namespace',
      'minApproval': 'Minimum Approval',
      'minRemoval': 'Minimum Removal'
    },

    keyPages: {
      'height': 'block',

      'harvester': 'account',
      'address': 'account',
      'signer': 'account',
      'recipient': 'account',
      'owneraddress': 'account',

      'transactionHash': 'transaction',
      'mosaicId': 'mosaic',

      'addressHeight': 'block',
      'publicKeyHeight': 'block',
      'importanceHeight': 'block',
      'blockHeight': 'block',
      'startHeight': 'block',
      'endHeight': 'block',

      'namespaceName': 'namespace',
      'namespaceId': 'namespace',
      'parentId': 'namespace',
      'linkedNamespace': 'namespace'
    }
  },

  getters: {
    getNameByKey: state => key => state.keyNames[key] != null ? state.keyNames[key] : key
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

        if (value != null) {
          if (typeof value !== 'number') {
            value = value.toLowerCase()
          }

          if (value === 'infinity') {
            return ''
          }

          router.push({ path: `/${pageName}/${value}` })
        } else { router.push({ path: `/${pageName}` }) }
      }
    },

    search: ({ dispatch }, searchString) => {
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
            let accountHttp = new AccountHttp(Endpoint.api)
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
