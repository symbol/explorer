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

import { UInt64, Address, QueryParams } from 'symbol-sdk'
import { ChainService } from '../infrastructure'
import http from './http'
import moment from 'moment'
import Constants from '../config/constants'
import format from '../format'

class BlockService {
  /**
   * Gets a BlockInfo for a given block height
   * @param height - Block height
   * @returns Formatted BlockDTO
   */
  static getBlockByHeight = async (height) => {
    const blockInfo = await http.block.getBlockByHeight(UInt64.fromUint(height)).toPromise()
    return this.formatBlock(blockInfo)
  }

  /**
   * Gets array of transactions included in a block for a block height
   * @param height - block height
   * @param transactionId - (Optional) retrive next transactions in pagination
   */
  static getBlockTransactions = async (height, transactionId) => {
    let id = transactionId || ''
    let pageSize = 10

    let transactions = await http.block
      .getBlockTransactions(UInt64.fromUint(height), new QueryParams({ pageSize, id }))
      .toPromise()

    // Todo
    return format.formatTransactions(transactions)
  }

  /**
   * Gets array of BlockInfo for a block height with limit
   * @param height - Block height
   * @param noOfBlock - Number of blocks returned.
   * @returns formatted BlockInfo[]
   */
  static getBlocksByHeightWithLimit = async (height, noOfBlock) => {
    const blocks = await http.block.getBlocksByHeightWithLimit(UInt64.fromUint(height), noOfBlock).toPromise()
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

    return blocks
  }

  /**
   * Get formatted BlockInfo dataset into Vue Component
   * @param height - Block height.
   * @returns Block info object
   */
  static getBlockInfo = async height => {
    const block = await this.getBlockByHeight(height)
    return block
  }

  /**
   * Format Block to readable Block object
   * @param BlockDTO
   * @returns Object readable BlockDTO object
   */
  static formatBlock = block => ({
    height: block.height.compact(),
    hash: block.hash,
    timestamp: Math.round(block.timestamp / 1000) + Constants.NetworkConfig.NEMESIS_TIMESTAMP,
    date: moment.utc(
      (Math.round(block.timestamp / 1000) + Constants.NetworkConfig.NEMESIS_TIMESTAMP) * 1000
    ).local().format('YYYY-MM-DD HH:mm:ss'),
    age: moment.utc(
      (Math.round(block.timestamp / 1000) + Constants.NetworkConfig.NEMESIS_TIMESTAMP) * 1000
    ).local().format('YYYY-MM-DD HH:mm:ss'),
    totalFee: format.formatFee(block.totalFee),
    difficulty: ((block.difficulty.compact() / 1000000000000).toFixed(2)).toString(),
    // feeMultiplier: format.microxemToXem(block.feeMultiplier).toLocaleString('en-US', { minimumFractionDigits: Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY }),
    transactions: block.numTransactions,
    signature: block.signature,
    signer: Address.createFromPublicKey(block.signer.publicKey, http.networkType).plain(),
    harvester: Address.createFromPublicKey(block.signer.publicKey, http.networkType).plain(),
    previousBlockHash: block.previousBlockHash,
    blockTransactionsHash: block.blockTransactionsHash,
    blockReceiptsHash: block.blockReceiptsHash,
    stateHash: block.stateHash
  })
}

export default BlockService
