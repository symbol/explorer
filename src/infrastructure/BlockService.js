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

import { UInt64 } from 'symbol-sdk'
import { ChainService, TransactionService } from '../infrastructure'
import http from './http'
import helper from '../helper'

class BlockService {
  /**
   * Gets a BlockInfo for a given block height
   * @param height - Block height
   * @returns Formatted BlockDTO
   */
  static getBlockByHeight = async (height) => {
    const blockInfo = await http.createRepositoryFactory.createBlockRepository()
      .getBlockByHeight(UInt64.fromUint(height)).toPromise()
    return this.formatBlock(blockInfo)
  }

  /**
   * Gets array of BlockInfo for a block height with limit
   * @param height - Block height
   * @param noOfBlock - Number of blocks returned.
   * @returns formatted BlockInfo[]
   */
  static getBlocksByHeightWithLimit = async (height, noOfBlock) => {
    const blocks = await http.createRepositoryFactory.createBlockRepository()
      .getBlocksByHeightWithLimit(UInt64.fromUint(height), noOfBlock).toPromise()

    const formattedBlocks = blocks.map(block => this.formatBlock(block))

    return formattedBlocks
  }

  /**
   * Get formatted BlockInfo[] dataset into Vue Component
   * @param noOfBlock - Number of blocks returned.
   * @param blockHeight - (Optional) the default is latest block height if not define.
   * @returns Block info list
   */
  static getBlockList = async (noOfBlock, blockHeight) => {
    let height = blockHeight === undefined ? await ChainService.getBlockchainHeight() + 1 : blockHeight
    const blocks = await this.getBlocksByHeightWithLimit(height - noOfBlock, noOfBlock)

    return blocks.map(block => ({
      ...block,
      date: helper.convertToUTCDate(block.timestamp),
      age: helper.convertToUTCDate(block.timestamp),
      harvester: block.signer
    }))
  }

  /**
   * Get Custom Transactions dataset into Vue Component
   * @param pageInfo - object for page info such as pageNumber, pageSize
   * @param filterVaule - object for search criteria
   * @param height -  block height
   * @returns Custom Transactions dataset
   */
  static getBlockTransactionList = async (pageInfo, filterVaule, height) => {
    const { pageNumber, pageSize } = pageInfo
    const searchCriteria = {
      pageNumber,
      pageSize,
      orderBy: 'desc',
      transactionTypes: filterVaule === '0' ? [] : [filterVaule],
      group: 'Confirmed',
      height: UInt64.fromUint(height)
    }

    const blockTransactions = await TransactionService.searchTransactions(searchCriteria)

    return {
      ...blockTransactions,
      data: blockTransactions.data.map(blockTransaction => ({
        ...blockTransaction,
        transactionId: blockTransaction.id,
        transactionHash: blockTransaction.hash,
        transactionDescriptor: blockTransaction.transactionBody.transactionDescriptor
      }))
    }
  }

  /**
   * Get formatted BlockInfo dataset into Vue Component
   * @param height - Block height.
   * @returns Block info object
   */
  static getBlockInfo = async height => {
    const block = await this.getBlockByHeight(height)
    return {
      ...block,
      blockHash: block.hash,
      harvester: block.signer,
      date: helper.convertToUTCDate(block.timestamp)
    }
  }

  /**
   * Format Block to readable Block object
   * @param BlockDTO
   * @returns Object readable BlockDTO object
   */
  static formatBlock = block => ({
    ...block,
    height: block.height.compact(),
    timestampRaw: block.timestamp,
    timestamp: helper.networkTimestamp(block.timestamp),
    totalFee: helper.toNetworkCurrency(block.totalFee),
    difficulty: helper.convertBlockDifficultyToReadable(block.difficulty),
    feeMultiplier: block.feeMultiplier.toString(),
    transactions: block.numTransactions,
    signer: helper.publicKeyToAddress(block.signer.publicKey)
  })
}

export default BlockService
