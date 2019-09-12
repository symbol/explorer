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
import format from './format'
import * as nemSdk from 'nem2-sdk'
import sdkBlock from './infrastructure/getBlock'
const url = window.conf.api

class DataService {
  // get home assets
  static getHomeData() {
    return new Promise(async (resolve, reject) => {
      try {
        sdkBlock.getBlocksWithLimit(25);
        const res = await axios.get(url + 'homeInfo')
        const data = res.data
        //  console.log(data);
        return resolve(data.data)
      } catch (err) {
        reject('request error homeinfo')
      }
    })
  }
  static getBlocks(page = 1) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + 'blocks?page=' + page)
        const data = res.data
        //  console.log(data);
        return resolve(data.data)
      } catch (err) {
        reject('request error getBlocks')
      }
    })
  }
  static getBlockinfo(blockID) {
    return new Promise(async (resolve, reject) => {
      try {
        const blockInfo = await sdkBlock.getBlockInfoByHeight(blockID)
        const blockTransactionList = await sdkBlock.getBlockFullTransactionsList(
          blockID
        )

        const data = { blockInfo, blockTransactionList }
        return resolve(data)
      } catch (err) {
        reject('request error getBlockinfo')
      }
    })
  }
  static getTrxdetail(trx_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + 'transaction/' + trx_id)
        const data = res.data
        //  console.log(data);
        return resolve(data.data)
      } catch (err) {
        reject('request error getBlockinfo')
      }
    })
  }
  static getAcntdetail(addrs) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + 'account/' + addrs)
        const data = res.data
        //  console.log(data);
        return resolve(data.data)
      } catch (err) {
        reject('request error getBlockinfo')
      }
    })
  }

  static syncWs(update_id = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + 'ws/' + update_id)
        const data = res.data
        return resolve(data)
      } catch (err) {
        reject('request error syncWs ')
      }
    })
  }
}
export default DataService
