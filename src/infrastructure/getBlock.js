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
import { QueryParams, UInt64 } from 'symbol-sdk'
import dto from './dto'
import http from './http'
import format from '../format'

class sdkBlock {
  static getBlockHeight = async () => {
    const blockHeight = await http.chain.getBlockchainHeight().toPromise()
    return blockHeight.compact()
  }

  static getBlockInfoByHeight = async (blockHeight) => {
    const blockInfo = await http.block.getBlockByHeight(UInt64.fromUint(blockHeight)).toPromise()
    return format.formatBlock(blockInfo)
  }

  static getBlockFullTransactionsList = async (blockHeight, transactionId) => {
    let txList = await this.getTransactionsByBlockHeight(blockHeight, transactionId)
    if (txList.length > 0) {
      transactionId = txList[txList.length - 1].transactionId
      const page = await this.getBlockFullTransactionsList(blockHeight, transactionId)
      txList = [...txList, ...page]
    }
    return txList
  }

  static getBlockLatestTransactionsList = async (blockHeight, transactionId) => {
    let txList = await this.getTransactionsByBlockHeight(blockHeight, transactionId)
    if (txList.length > 0) {
      transactionId = txList[txList.length - 1].transactionId
      const page = await this.getTransactionsByBlockHeight(blockHeight, transactionId)
      txList = [...txList, ...page]
    }
    return format.formatBlocktransactions(txList)
  }

  static getBlockTransactionsFromId = async (blockHeight, transactionId) => {
    let txList = await this.getTransactionsByBlockHeight(blockHeight, transactionId)
    return format.formatBlocktransactions(txList)
  }

  static getTransactionsByBlockHeight = async (blockHeight, transactionId) => {
    transactionId = transactionId || ''
    const pageSize = 10

    let transactions = await http.block
      .getBlockTransactions(UInt64.fromUint(blockHeight), new QueryParams({ pageSize, id: transactionId }))
      .toPromise()

    return format.formatTransactions(transactions)
  }

  static getReceiptsByBlockHeight = async blockHeight => {
    const blockReceipts = await http.receipt
      .getBlockReceipts(UInt64.fromUint(blockHeight))
      .toPromise()

    let transactionReceipt = blockReceipts.transactionStatements.reduce((receipt, item) => {
      receipt.push(...item.receipts)
      return receipt
    }, []) || []

    let resolutionStatements = [...blockReceipts.addressResolutionStatements, ...blockReceipts.mosaicResolutionStatements]

    return {
      transactionReceipt: format.formatReceiptStatements(transactionReceipt),
      resolutionStatements: format.formatResolutionStatements(resolutionStatements)
    }
  }

  static getBlocksFromHeightWithLimit = async (limit, fromBlockHeight) => {
    let blockHeight
    if (fromBlockHeight === undefined)
      blockHeight = 'latest'
    else
      blockHeight = fromBlockHeight.toString()

    // Make request.
    const path = `/blocks/from/${blockHeight}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const blocks = response.data.map(info => dto.createBlockInfoFromDTO(info, http.networkType))

    return format.formatBlocks(blocks)
  }

  static getBlocksSinceHeightWithLimit = async (limit, sinceBlockHeight) => {
    let blockHeight
    if (sinceBlockHeight === undefined)
      blockHeight = 'earliest'
    else
      blockHeight = sinceBlockHeight.toString()

    // Make request.
    const path = `/blocks/since/${blockHeight}/limit/${limit}`
    const response = await axios.get(http.nodeUrl + path)
    const blocks = response.data.map(info => dto.createBlockInfoFromDTO(info, http.networkType))

    return format.formatBlocks(blocks)
  }

  static getBlockInfoByHeightFormatted = async height => {
    let rawBlockInfo
    let formattedBlockInfo
    let blockReceipt
    let formattedBalanceChangeReceipt
    let formattedBalanceTransferReceipt
    let formattedinflationReceipt
    let lastTransactions

    try { rawBlockInfo = await this.getBlockInfoByHeight(height) } catch (e) { throw Error('Failed to fetch block info', e) }

    try { blockReceipt = await this.getReceiptsByBlockHeight(height) } catch (e) { console.warn(e) }

    try { lastTransactions = await this.getBlockLatestTransactionsList(height) } catch (e) { console.warn(e) }

    if (rawBlockInfo) {
      formattedBlockInfo = {
        height: rawBlockInfo.height,
        date: rawBlockInfo.date,
        fee: rawBlockInfo.totalFee,
        difficulty: rawBlockInfo.difficulty,
        feeMultiplier: rawBlockInfo.feeMultiplier,
        totalTransactions: rawBlockInfo.numTransactions,
        harvester: rawBlockInfo.signer,
        blockHash: rawBlockInfo.hash
      }

      const { artifactExpiryReceipt, balanceChangeReceipt, balanceTransferReceipt, inflationReceipt } = blockReceipt.transactionReceipt

      formattedBalanceTransferReceipt = balanceTransferReceipt?.map(el => ({
        version: el.version,
        type: el.type,
        size: el.size,
        senderAddress: el.sender,
        recipient: el.recipientAddress,
        mosaicId: el.mosaicId,
        amount: el.amount
      }))

      formattedBalanceChangeReceipt = balanceChangeReceipt?.map(el => ({
        version: el.version,
        type: el.type,
        size: el.size,
        address: el.targetPublicAccount,
        amount: el.amount,
        mosaicId: el.mosaicId
      }))

      formattedinflationReceipt = inflationReceipt?.map(el => ({
        version: el.version,
        size: el.size,
        amount: el.amount,
        mosaicId: el.mosaicId
      }))

      return {
        blockInfo: formattedBlockInfo || {},
        inflationReceipt: formattedinflationReceipt || [],
        balanceTransferReceipt: formattedBalanceTransferReceipt || [],
        balanceChangeReceipt: formattedBalanceChangeReceipt || [],
        artifactExpiryReceipt: artifactExpiryReceipt || [],
        resolutionStatements: blockReceipt.resolutionStatements || [],
        lastTransactions: lastTransactions || []
      }
    }
  }
}

export default sdkBlock
