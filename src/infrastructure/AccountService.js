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

import { Address } from 'symbol-sdk'
import http from './http'
import format from '../format'
import { Constants } from '../config'
import { DataService, NamespaceService } from '../infrastructure'
import helper from '../helper'

class AccountService {
  /**
   * Gets an AccountInfo for an account.
   * @param address
   * @returns Formatted AccountInfo
   */
  static getAccount = async address => {
    const account = await http.account.getAccountInfo(address).toPromise()
    const formattedAccount = this.formatAccountInfo(account)

    return formattedAccount
  }

  /**
   * Get custom Account list dataset into Vue Component
   * @param limit - No of account
   * @param accountType - filter account type
   * @param fromAddress - (Optional) retrive next account in pagination
   * @returns Custom AccountInfo[]
   */
  static getAccountList = async (limit, accountType, fromAddress) => {
    const accountInfos = await DataService.getAccountsFromAddressWithLimit(limit, accountType, fromAddress)

    const addresses = accountInfos.map(accountInfo => accountInfo.address)
    const accountNames = await NamespaceService.getAccountsNames(addresses)

    const formattedAccountInfos = accountInfos.map(accountInfo => this.formatAccountInfo(accountInfo))

    return formattedAccountInfos.map(formattedAccountInfo => ({
      ...formattedAccountInfo,
      balance: helper.getNetworkCurrencyBalance(formattedAccountInfo.mosaics),
      lastActivity: helper.getLastActivityHeight(formattedAccountInfo.activityBucket),
      accountAliasName: this.extractAccountNamespace(formattedAccountInfo, accountNames)
    }))
  }

  /**
   * Format AccountInfo to readable accountInfo objecy
   * @param accountInfo - AccountInfo DTO
   * @returns Readable AccountInfo DTO object
   */
  static formatAccountInfo = (accountInfo) => ({
    ...accountInfo,
    address: accountInfo.address.address,
    addressHeight: accountInfo.addressHeight.compact(),
    publicKeyHeight: accountInfo.publicKeyHeight.compact(),
    type: Constants.AccountType[accountInfo.accountType],
    linkedAccountKey: Constants.AccountType[accountInfo.accountType] === 'Unlinked' ? Constants.Message.UNAVAILABLE : Address.createFromPublicKey(accountInfo.linkedAccountKey, http.networkType).plain(),
    importance: format.ImportanceScoreToPercent(accountInfo.importance.compact()),
    importanceHeight: accountInfo.importanceHeight.compact()
  })

  /**
   * Extract Name for Account
   * @param accountInfo - accountInfo DTO
   * @param accountNames - accountNames[]
   * @returns accountName
   */
  static extractAccountNamespace = (accountInfo, accountNames) => {
    let accountName = accountNames.find((name) => name.address === accountInfo.address)
    const name = accountName.names.length > 0 ? accountName.names[0].name : Constants.Message.UNAVAILABLE
    return name
  }
}

export default AccountService