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

import { Address, TransactionType } from 'symbol-sdk'
import http from './http'
import { Constants } from '../config'
import { DataService, NamespaceService, TransactionService } from '../infrastructure'
import helper from '../helper'

class AccountService {
  /**
   * Gets an AccountInfo for an account.
   * @param address
   * @returns Formatted AccountInfo
   */
  static getAccount = async address => {
    const account = await http.createRepositoryFactory.createAccountRepository()
      .getAccountInfo(Address.createFromRawAddress(address))
      .toPromise()

    const formattedAccount = this.formatAccountInfo(account)

    return formattedAccount
  }

  /**
   * Gets an AccountInfo for an account.
   * @param address
   * @returns Formatted AccountInfo
   */
  static getAccounts = async addresses => {
    const accounts = await http.createRepositoryFactory.createAccountRepository()
      .getAccountsInfo(addresses.map(a => Address.createFromRawAddress(a)))
      .toPromise()

    return accounts.map(a => this.formatAccountInfo(a))
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
   * Get custom Account info dataset into Vue Component
   * @param address - Account address
   * @returns Custom AccountInfo
   */
  static getAccountInfo = async address => {
    const accountInfo = await this.getAccount(address)
    const accountNames = await NamespaceService.getAccountsNames([Address.createFromRawAddress(address)])
    return {
      ...accountInfo,
      activityBucket: accountInfo.activityBucket.map(activity => ({
        ...activity,
        recalculationBlock: activity.startHeight,
        totalFeesPaid: helper.toNetworkCurrency(activity.totalFeesPaid),
        importanceScore: activity.rawScore
      })),
      accountAliasName: this.extractAccountNamespace(accountInfo, accountNames)
    }
  }

  /**
   * Gets custom array of confirmed transactions dataset into Vue Component
   * @param pageInfo - object for page info such as pageNumber, pageSize
   * @param filterVaule - object for search criteria
   * @param address - Account address
   * @returns Custom AggregateTransaction[]
   */
  static getAccountTransactionList = async (pageInfo, filterVaule, address) => {
    const { pageNumber, pageSize } = pageInfo
    const searchCriteria = {
      pageNumber,
      pageSize,
      orderBy: 'desc',
      transactionTypes: filterVaule === '0' ? [] : [filterVaule],
      group: 'Confirmed',
      address: Address.createFromRawAddress(address)
    }

    const accountTransactions = await TransactionService.searchTransactions(searchCriteria)

    return {
      ...accountTransactions,
      data: accountTransactions.data.map(accountTransaction => ({
        ...accountTransaction,
        transactionId: accountTransaction.id,
        transactionHash: accountTransaction.hash,
        transactionDescriptor:
          accountTransaction.transactionBody.type === TransactionType.TRANSFER
            ? (accountTransaction.signer === address
              ? 'outgoing_' + accountTransaction.transactionBody.transactionDescriptor
              : 'incoming_' + accountTransaction.transactionBody.transactionDescriptor
            )
            : accountTransaction.transactionBody.transactionDescriptor
      }))
    }
  }

  /**
   * Gets custom array of account partial transactions dataset into Vue Component
   * @param pageInfo - object for page info such as pageNumber, pageSize
   * @param filterVaule - object for search criteria
   * @param address - Account address
   * @returns Custom Transaction[]
   */
  static getAccountPartialTransactionList = async (pageInfo, filterVaule, address) => {
    const searchCriteria = {
      ...pageInfo,
      id: 'id',
      orderBy: 'desc',
      transactionTypes: [filterVaule],
      group: 'Partial',
      address: Address.createFromRawAddress(address)
    }

    const partialTransactions = await TransactionService.searchTransactions(searchCriteria)

    return {
      ...partialTransactions,
      data: partialTransactions.data.map(partialTransactions => ({
        ...partialTransactions,
        transactionHash: partialTransactions.hash,
        transactionType: partialTransactions.transactionBody.type
      }))
    }
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
    supplementalAccountKeys: accountInfo.supplementalAccountKeys.map(accountKey => ({
      ...accountKey,
      accountKeyType: Constants.AccountKeyType[accountKey.keyType]
    })),
    importance: helper.ImportanceScoreToPercent(accountInfo.importance.compact()),
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
