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

import axios from 'axios'
import { QueryParams, Address } from 'nem2-sdk'
import dto from './dto'
import http from './http'
import format from '../format'
import sdkBlock from '../infrastructure/getBlock'

class sdkTransaction {
  static getAccountTransactions = async (address, transactionId = '') => {
    let pageSize = 100

    const transactionsList = await http.account
      .transactions(Address.createFromRawAddress(address), new QueryParams(pageSize, transactionId))
      .toPromise()

    return format.formatTransactions(transactionsList)
  }

  static getTransactionInfoByHash = async (hash) => {
    const transaction = await http.transaction.getTransaction(hash).toPromise()
    const formattedTransaction = format.formatTransaction(transaction)
    const getBlockInfo = await sdkBlock.getBlockInfoByHeight(formattedTransaction.blockHeight)

    const transactionStatus = await http.transaction
      .getTransactionStatus(hash)
      .toPromise()

    const transactionInfo = {
      transaction: formattedTransaction,
      status: transactionStatus.status,
      confirm: transactionStatus.group,
      timestamp: getBlockInfo.date
    }

    return transactionInfo
  }

  static getTransactionsFromHashWithLimit = async (limit, transactionType, fromHash) => {
    let hash
    if (fromHash === undefined) {
      hash = 'latest'
    } else {
      hash = fromHash.toString()
    }

    // Get the path to the URL dependent on the config
    let path
    if (transactionType === undefined) {
      path = `/transactions/from/${hash}/limit/${limit}`
    } else if (transactionType === 'unconfirmed') {
      path = `/transactions/unconfirmed/from/${hash}/limit/${limit}`
    } else if (transactionType === 'partial') {
      path = `/transactions/partial/from/${hash}/limit/${limit}`
    } else {
      const array = transactionType.split('/')
      if (array.length === 1) {
        // No filter present
        path = `/transactions/from/${hash}/type/${transactionType}/limit/${limit}`
      } else {
        // We have a filter.
        path = `/transactions/from/${hash}/type/${array[0]}/filter/${array[1]}/limit/${limit}`
      }
    }

    // Make request.
    const networkType = await http.network.getNetworkType().toPromise()
    const response = await axios.get(http.nodeUrl + path)
    const transactions = response.data.map(info => dto.createTransactionFromDTO(info, networkType))

    return format.formatTransactions(transactions)
  }

  static getTransactionsSinceHashWithLimit = async (limit, transactionType, sinceHash) => {
    let hash
    if (sinceHash === undefined) {
      hash = 'earliest'
    } else {
      hash = sinceHash.toString()
    }

    let path
    if (transactionType === undefined) {
      path = `/transactions/since/${hash}/limit/${limit}`
    } else if (transactionType === 'unconfirmed') {
      path = `/transactions/unconfirmed/since/${hash}/limit/${limit}`
    } else if (transactionType === 'partial') {
      path = `/transactions/partial/since/${hash}/limit/${limit}`
    } else {
      const array = transactionType.split('/')
      if (array.length === 1) {
        // No filter present
        path = `/transactions/since/${hash}/type/${transactionType}/limit/${limit}`
      } else {
        // We have a filter.
        path = `/transactions/since/${hash}/type/${array[0]}/filter/${array[1]}/limit/${limit}`
      }
    }

    // Make request.
    const networkType = await http.network.getNetworkType().toPromise()
    const response = await axios.get(http.nodeUrl + path)
    const transactions = response.data.map(info => dto.createTransactionFromDTO(info, networkType))

    return format.formatTransactions(transactions)
  }
}

export default sdkTransaction
