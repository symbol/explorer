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

const { AccountHttp, Address  } = require('nem2-sdk');
const utils = require('../utils');

const endpoint = utils.getNodeEndPoint();

const accountHttp = new AccountHttp(endpoint);

async function getAccountInfoByAddress(address) {

   const accountInfo = await accountHttp.getAccountInfo(new Address(address)).toPromise()

   return await utils.formatAccount(accountInfo)
}

async function getAccountTransactionsByAddress(address) {

    const accountInfo = await getAccountInfoByAddress(address);

    const transactionsList = await accountHttp.transactions(accountInfo).toPromise();

    return await utils.formatTxs(transactionsList);
}

module.exports = {
    getAccountInfoByAddress,
    getAccountTransactionsByAddress,
}