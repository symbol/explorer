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
import { QueryParams } from 'nem2-sdk'
import dto from './dto'
import http from './http'
import format from '../format'

class sdkBlock {
  static getBlockHeight = async () => {
    const blockHeight = await http.chain.getBlockchainHeight().toPromise()
    return blockHeight.compact()
  }

  static getBlockInfoByHeight = async (blockHeight) => {
    const blockInfo = await http.block.getBlockByHeight(blockHeight).toPromise()
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

    let transactions = await http.block
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
    const response = await axios.get(http.nodeUrl + path)
    const blocks = response.data.map(info => dto.createBlockInfoFromDTO(info, http.networkType))

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
    const response = await axios.get(http.nodeUrl + path)
    const blocks = response.data.map(info => dto.createBlockInfoFromDTO(info, http.networkType))

    return format.formatBlocks(blocks)
  }

  static getBlockInfoByHeightFormatted = async height => {
    let rawBlockInfo
    let formattedBlockInfo
    let blockTransactionList
    let transactionList

    try { rawBlockInfo = await this.getBlockInfoByHeight(height) } catch (e) { throw Error('Failed to fetch block info', e) }

    try { blockTransactionList = await this.getBlockFullTransactionsList(height) } catch (e) { console.warn(e) }

    if (rawBlockInfo) {
      formattedBlockInfo = {
        height: rawBlockInfo.height,
        date: rawBlockInfo.date,
        fee: rawBlockInfo.totalFee,
        difficulty: rawBlockInfo.difficulty,
        feeMultiplier: rawBlockInfo.feeMultiplier,
        totalTransactions: rawBlockInfo.numTransactions,
        harvester: rawBlockInfo.signer?.address?.address,
        blockHash: rawBlockInfo.hash
      }

      transactionList = []
      if (blockTransactionList.length) {
        transactionList = blockTransactionList.map((el) => ({
          deadline: el.deadline,
          transactionHash: el.transactionHash,
          //fee: el.fee,
          //signer: el.signer,
          type: el.transactionBody.type
        }))
      }

      return {
        blockInfo: formattedBlockInfo || {},
        transactionList: transactionList || []
      }
    }
  }
}

export default sdkBlock
