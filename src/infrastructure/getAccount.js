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

import { Address } from 'nem2-sdk'
import http from './http'
import format from '../format'
import sdkTransaction from '../infrastructure/getTransaction'
import sdkNamespace from '../infrastructure/getNamespace'

class sdkAccount {
  static getAccountInfoByAddress = async address => {
    let addressObj = Address.createFromRawAddress(address)

    const accountInfo = await http.account
      .getAccountInfo(addressObj)
      .toPromise()

    const accountNames = await http.account
      .getAccountsNames([addressObj])
      .toPromise()

    return format.formatAccount(accountInfo, accountNames)
  }

  static getMultisigAccountByAddress = async address => {
    let addressObj = Address.createFromRawAddress(address)
    let accountMultisig

    try {
      accountMultisig = await http.account
        .getMultisigAccountInfo(addressObj)
        .toPromise()
    } catch (e) {
      // To Catach statusCode 404 if Address is not belong to Multisig
      throw Error('Address is not belong to Multisig')
    }

    return format.formatAccountMultisig(accountMultisig)
  }

  static getAccountInfoByAddressFormatted = async address => {
    let rawAccountInfo
    let formattedAccountInfo
    let mosaicList
    let accountMultisig
    let formattedAccountMultisig
    let accountMultisigCosignatories

    let transactionList
    let formattedTansactionList

    let namespaceList
    let formattedNamespaceList

    try { rawAccountInfo = await this.getAccountInfoByAddress(address) } catch (e) { throw Error('Failed to get account info', e) }

    try { accountMultisig = await sdkAccount.getMultisigAccountByAddress(address) } catch (e) { console.warn(e) }

    try { transactionList = await sdkTransaction.getAccountTransactions(address) } catch (e) { console.warn(e) }

    try { namespaceList = await sdkNamespace.getNamespacesFromAccountByAddress(address) } catch (e) { console.warn(e) }

    if (rawAccountInfo) {
      formattedAccountInfo = {
        address: rawAccountInfo.address.address,
        linkedNamespace: rawAccountInfo.accountAliasName,
        addressHeight: rawAccountInfo.addressHeight,
        publicKey: rawAccountInfo.publicKey,
        // publicKeyHeight: rawAccountInfo.publicKeyHeight,
        importance: rawAccountInfo.importance,
        // importanceHeight: rawAccountInfo.importanceHeight,
        accountType: rawAccountInfo.accountType,
        linkedAccountKey: rawAccountInfo.linkedAccountKey
      }
      mosaicList = Array.isArray(rawAccountInfo.mosaics)
        ? rawAccountInfo.mosaics.map(el => ({
          mosaicId: el.id,
          amount: el.amount
        }))
        : []
    }

    if (accountMultisig) {
      formattedAccountMultisig = {
        minApproval: accountMultisig.minApproval,
        minRemoval: accountMultisig.minRemoval
      }
      if (accountMultisig.cosignatories) { accountMultisigCosignatories = accountMultisig.cosignatories }
    }

    if (transactionList) {
      formattedTansactionList = transactionList.map(el => ({
        deadline: el.deadline,
        fee: el.fee,
        transactionHash: el.transactionHash,
        transactionType: el.transactionBody.type
      }))
    }

    if (namespaceList) {
      formattedNamespaceList = namespaceList.map(
        el => ({
          namespaceName: el.namespaceName,
          registrationType: el.type,
          status: el.active,
          startHeight: el.startHeight,
          endHeight: el.endHeight
        })
      )
    }

    return {
      // rawAccountInfo: rawAccountInfo || {},
      accountInfo: formattedAccountInfo || {},
      mosaicList: mosaicList || [],
      multisigInfo: formattedAccountMultisig || {},
      multisigCosignatoriesList: accountMultisigCosignatories || [],
      tansactionList: formattedTansactionList || [],
      namespaceList: formattedNamespaceList || []
    }
  }
}

export default sdkAccount
