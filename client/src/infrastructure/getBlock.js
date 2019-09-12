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

import { BlockHttp, ChainHttp, QueryParams } from 'nem2-sdk'
import format from '../format'
import store from '../store'

const chainHttp = new ChainHttp('http://52.194.207.217:3000')
const blockHttp = new BlockHttp('http://52.194.207.217:3000')

class sdkBlock {
  static getBlockHeight = async () => {
    return (await chainHttp.getBlockchainHeight().toPromise()).compact()
  }

  static getBlockInfoByHeight = async (blockHeight) => {
    const blockInfo = await blockHttp.getBlockByHeight(blockHeight).toPromise()

    return format.formatBlock(blockInfo)
  }

  static getBlockFullTransactionsList = async (blockHeight, id) => {
    let txList = await this.getTransactionsByBlockHeight(blockHeight, id)
    if (txList.length > 0) {
      id = txList[txList.length - 1].transactionId
      txList.concat(await this.getBlockFullTransactionsList(blockHeight, id))
    }
    return txList
  }

  static getTransactionsByBlockHeight = async (blockHeight, id) => {
    let txId = id || ''
    const pageSize = 100

    let transactionlist = await blockHttp
      .getBlockTransactions(blockHeight, new QueryParams(pageSize, txId))
      .toPromise()

    if (transactionlist.length > 0) {
      return format.formatTransactions(transactionlist)
    }

    return transactionlist
  }

  static getBlocksWithLimit = async (numberOfBlock, fromBlockHeight) => {
    const currentBlockHeight = await this.getBlockHeight()

    let blockHeight = fromBlockHeight || currentBlockHeight

    const blocks = await blockHttp
      .getBlocksByHeightWithLimit(blockHeight, numberOfBlock)
      .toPromise()

    store.dispatch(
      'SET_BLOCKS_LIST',
      format.formatBlocks(blocks),
      { root: true },
    );

    if (store.getters.getCurrentBlockHeight == 0 && store.getters.getCurrentBlockHeight < blocks[0].height.compact()) {
      store.dispatch(
        'SET_LATEST_CHAIN_STATUS',
        format.formatBlock(blocks[0]),
        { root: true },
      );
    }

    return await format.formatBlocks(blocks)
  }
}

export default sdkBlock
