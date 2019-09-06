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

// const blockInfo = await blocks.getBlockInfoByHeight(height);
// const blockTransactionList = await blocks.getBlockFullTransactionsList(
//     height

import { BlockHttp, ChainHttp } from 'nem2-sdk'
import helper from '../helper'

const chainHttp = new ChainHttp(endpoint);
const blockHttp = new BlockHttp(endpoint);

class sdkBlock {
    static getBlockHeight() {
        return (await chainHttp.getBlockchainHeight().toPromise()).compact();
    }

    static getBlockInfoByHeight(blockHeight) {
        const blockInfo = await blockHttp.getBlockByHeight(blockHeight).toPromise();

        return blockInfo
    }

    static getBlockFullTransactionsList(blockHeight, id) {
        let txList = await getTransactionsByBlockHeight(blockHeight, id);
        if (txList.length > 0) {
            id = txList[txList.length - 1].transactionId;
            txList.concat(await getBlockFullTransactionsList(blockHeight, id));
        }
        return txList;
    }

    static getTransactionsByBlockHeight(blockHeight, id) {
        let txId = id || '';
        const pageSize = 100;

        let transactionlist = await blockHttp
            .getBlockTransactions(blockHeight, new QueryParams(pageSize, txId))
            .toPromise();

        if (transactionlist.length > 0) {
            return utils.formatTxs(transactionlist);
        }

        return transactionlist;
    }

    static getBlocksWithLimit(numberOfBlock, fromBlockHeight) {
        const currentBlockHeight = await getBlockHeight();

        let blockHeight = fromBlockHeight || currentBlockHeight;

        const blocks = await blockHttp
            .getBlocksByHeightWithLimit(blockHeight, numberOfBlock)
            .toPromise();

        return await utils.formatBlocks(blocks);
    }
}

export default sdkBlock