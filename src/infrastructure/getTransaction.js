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
import {
  AccountHttp,
  NetworkHttp,
  TransactionHttp,
  QueryParams,
  Address
} from 'nem2-sdk'
import dto from './dto'
import format from '../format'
import { Endpoint } from '../config/'
import sdkBlock from '../infrastructure/getBlock'

const NETWORK_HTTP = new NetworkHttp(Endpoint.api)
const TRANSACTION_HTTP = new TransactionHttp(Endpoint.api);
const ACCOUNT_HTTP = new AccountHttp(Endpoint.api)

class sdkTransaction {
  static getAccountTransactions = async (address, transactionId = '') => {
    let pageSize = 100

    const transactionsList = await ACCOUNT_HTTP
      .transactions(Address.createFromRawAddress(address), new QueryParams(pageSize, transactionId))
      .toPromise()

    return format.formatTransactions(transactionsList)
  }

  static getTransactionInfoByHash = async (hash) => {
    const transaction = await TRANSACTION_HTTP.getTransaction(hash).toPromise()
    const formattedTransaction = format.formatTransaction(transaction)
    const getBlockInfo = await sdkBlock.getBlockInfoByHeight(formattedTransaction.blockHeight)

    const transactionStatus = await TRANSACTION_HTTP
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

  static getTransactionsFromHashWithLimit = async (limit, fromHash) => {
    let hash
    if (fromHash === undefined) {
      hash = 'latest'
    } else {
      hash = fromHash.toString()
    }

    // Make request.
    const networkType = await NETWORK_HTTP.getNetworkType().toPromise()
    const path = `/transactions/from/${hash}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const transactions = response.data.map(info => dto.createTransactionFromDTO(info, networkType))

    // TODO(ahuszagh) Ensure this works well...
    //return format.formatTransactions(blocks)
    return []
  }

  // TODO(ahuszagh) Need to get transactions by type...
}

export default sdkTransaction
