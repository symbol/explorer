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

import {
  AccountHttp,
  TransactionHttp,
  QueryParams,
  PublicAccount,
  NetworkType,
  TransactionMapping
} from 'nem2-sdk'
import format from '../format'
import { Endpoint } from '../config/'
import request from 'request'
import sdkBlock from '../infrastructure/getBlock'

const accountHttp = new AccountHttp(Endpoint.api)
const transactionHttp = new TransactionHttp(Endpoint.api);

class sdkTransaction {
  static getAccountTransactions = async (publicKey, transactionId = '') => {
    let pageSize = 100

    const publicAccount = PublicAccount.createFromPublicKey(
      publicKey,
      NetworkType.MIJIN_TEST
    )

    const transactionsList = await accountHttp
      .transactions(publicAccount, new QueryParams(pageSize, transactionId))
      .toPromise()

    return format.formatTransactions(transactionsList)
  }

  static getTransaction(hash) {
    return new Promise((resolve, reject) => {
      request(Endpoint.api + '/transaction/' + hash, (error, response, body) => {
        if (error) return reject(error);
        let info = JSON.parse(body);
        return resolve(info);
      });
    });
  }

  static getTransactionInfoByHash = async (hash) => {
    const transaction = await this.getTransaction(hash);
    // const transaction1 = await transactionHttp.getTransaction(hash).toPromise(); // waiting SDK fix duel rest change
    const formattedTransaction = format.formatTransaction(TransactionMapping.createFromDTO(transaction))
    const getBlockInfo = await sdkBlock.getBlockInfoByHeight(formattedTransaction.blockHeight)

    const transactionStatus = await transactionHttp
      .getTransactionStatus(hash)
      .toPromise();

    const transactionInfo = {
      transaction: formattedTransaction,
      status: transactionStatus.status,
      confirm: transactionStatus.group,
      timestamp: getBlockInfo.date
    };

    return transactionInfo;
  }
}

export default sdkTransaction
