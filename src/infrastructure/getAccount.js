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

    try { rawAccountInfo = await this.getAccountInfoByAddress(address) } 
      catch (e) { throw Error('Failed to get account info', e) }
    
    try { accountMultisig = await sdkAccount.getMultisigAccountByAddress(address) } 
      catch (e) {
        console.log(e)
      }
    
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
      if(accountMultisig.cosignatories)
        accountMultisigCosignatories = accountMultisig.cosignatories
    }

    return {
      rawAccountInfo: rawAccountInfo || {},
      formattedAccountInfo: formattedAccountInfo || {},
      mosaicList: mosaicList || [],
      formattedAccountMultisig: formattedAccountMultisig || {},
      accountMultisigCosignatories: accountMultisigCosignatories || []
    } 
  }

  static getMultisigAccountByAddressFormatted = async address => {
    let accountMultisig = {}

    try { accountMultisig = await sdkAccount.getMultisigAccountByAddress(address) } 
    catch (e) {
      throw e
    }

    if (accountMultisig) {
      let formattedAccountMultisig = {
        minApproval: accountMultisig.minApproval,
        minRemoval: accountMultisig.minRemoval
      }

      commit('accountMultisig', formattedAccountMultisig)
      commit('accountMultisigCosignatories', accountMultisig.cosignatories)
    }
  }
}

export default sdkAccount
