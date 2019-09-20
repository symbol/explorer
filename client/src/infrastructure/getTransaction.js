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
  QueryParams,
  PublicAccount,
  NetworkType
} from 'nem2-sdk'
import format from '../format'
import { Endpoint } from '../config/'

const ACCOUNT_HTTP = new AccountHttp(Endpoint.api)

class sdkTransaction {
  static getAccountTransactions = async (publicKey, transactionId = '') => {
    let pageSize = 100

    const publicAccount = PublicAccount.createFromPublicKey(
      publicKey,
      NetworkType.MIJIN_TEST
    )

    const transactionsList = await ACCOUNT_HTTP
      .transactions(publicAccount, new QueryParams(pageSize, transactionId))
      .toPromise()

    return format.formatTransactions(transactionsList)
  }
}

export default sdkTransaction
