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
import { BlockHttp, ChainHttp, QueryParams } from 'nem2-sdk'
import dto from './dto'
import format from '../format'
import { Endpoint } from '../config'

const CHAIN_HTTP = new ChainHttp(Endpoint.api)
const BLOCK_HTTP = new BlockHttp(Endpoint.api)

class sdkBlock {
  static getBlockHeight = async () => {
    const blockHeight = await CHAIN_HTTP.getBlockchainHeight().toPromise()
    return blockHeight.compact()
  }

  static getBlockInfoByHeight = async (blockHeight) => {
    const blockInfo = await BLOCK_HTTP.getBlockByHeight(blockHeight).toPromise()
    return format.formatBlock(blockInfo)
  }

  static getBlockFullTransactionsList = async (blockHeight, transactionId) => {
    let txList = await this.getTransactionsByBlockHeight(blockHeight, transactionId)
    if (txList.length > 0) {
      transactionId = txList[txList.length - 1].transactionId
      txList.concat(await this.getBlockFullTransactionsList(blockHeight, transactionId))
    }
    return txList
  }

  static getTransactionsByBlockHeight = async (blockHeight, transactionId) => {
    transactionId = transactionId || ''
    const pageSize = 100

    let transactions = await BLOCK_HTTP
      .getBlockTransactions(blockHeight, new QueryParams(pageSize, transactionId))
      .toPromise()

    return format.formatTransactions(transactions)
  }

  static getBlocksFromHeightWithLimit = async (limit, fromBlockHeight) => {
    let blockHeight
    if (fromBlockHeight === undefined) {
      blockHeight = 'latest'
    } else {
      blockHeight = fromBlockHeight.toString()
    }

    // Make request.
    const path = `/blocks/from/${blockHeight}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const blocks = response.data.map(dto.createBlockFromDTO)

    return format.formatBlocks(blocks)
  }

  static getBlocksSinceHeightWithLimit = async (limit, sinceBlockHeight) => {
    let blockHeight
    if (sinceBlockHeight === undefined) {
      blockHeight = 'earliest'
    } else {
      blockHeight = sinceBlockHeight.toString()
    }

    // Make request.
    const path = `/blocks/since/${blockHeight}/limit/${limit}`
    const response = await axios.get(Endpoint.api + path)
    const blocks = response.data.map(dto.createBlockFromDTO)

    return format.formatBlocks(blocks)
  }
}

export default sdkBlock
