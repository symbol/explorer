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

import { AccountHttp, Address } from 'nem2-sdk'
import http from './http'
import format from '../format'

class sdkAccount {
  // TODO(ahuszagh) Remove
  static init = async nodeUrl => {
  }

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
}

export default sdkAccount
