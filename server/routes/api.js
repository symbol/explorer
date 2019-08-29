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

var express = require('express');
var router = express.Router();

const { homeInfo, blocks,transactions,accounts,namespaces,mosaics} = require('../controller/index');

router.get('/ws/:page_id', async function (req, res, next) {
    if (req.params.page_id == 'home') {
        setInterval(async () => {
            getdata();
        }, 4000);
        let ht_prev = 0;
        async function getdata() {
            let ht = await blocks.getBlockHeight();
            if (ht > ht_prev) {
                ht_prev = ht;
                let chainInfo = await homeInfo.getChainInfo();
                let recentBlocks = await blocks.getBlocksWithLimit(4);
                req.app.io.emit('update', { data: { ht, chainInfo, recentBlocks } });
            }
        }
    } else if (req.params.page_id == 'blocks') {
        setInterval(async () => {
            getdata();
        }, 4000);
        let ht_prev = 0;
        async function getdata() {
            let ht = await blocks.getBlockHeight();
            if (ht > ht_prev) {
                ht_prev = ht;
                const blockList = await blocks.getBlocksWithLimit(20, ht);
                req.app.io.emit('update', { data: { hight: ht, blockList } });
            }
        }
    }
    res.json({ 'msg': 'ok' })
});
router.get('/homeInfo', async function (req, res, next) {
    // Todo: Average block time
    let marketData = await homeInfo.getMarketData();
    let chainInfo = await homeInfo.getChainInfo();
    let ht = await blocks.getBlockHeight();
    let recentBlocks = await blocks.getBlocksWithLimit(4, ht);
    res.json({
        data: {
            marketData,
            chainInfo,
            recentBlocks
        }
    });
});
router.get('/blocks', async function (req, res, next) {
    let ht = await blocks.getBlockHeight();
    if (req.query.page) {
        fromblock = ht - (15*(req.query.page));
        const blockList = await blocks.getBlocksWithLimit(20, fromblock);
        res.json({
            data: {
                hight: ht,
                blockList,
            },
        });
    } else {
        const blockList = await blocks.getBlocksWithLimit(20, ht);
        res.json({
            data: {
                hight: ht,
                blockList,
            },
        });
    }
});

router.get('/block/:blkhight', async function (req, res, next) {
    var blkhight = req.params.blkhight;
    if (blkhight) {
        const blockdata = await blocks.getBlockInfoByHeight( blkhight);
        const blocktrx = await blocks.getBlockFullTransactionsList( blkhight);
        res.json({
            data: {
                blockdata,blocktrx
            },
        });
    } else {
        res.json({
            data: 0,
        });
    }
});
router.get('/transactions', (req, res, next) => {
	// Todo: get transactions list
});

router.get('/transaction/:txHash', async (req, res, next) => {
	const txHash = req.params.txHash;
	try {
		const transactionInfo = await transactions.getTransactionInfoByHash(txHash);
		res.status(200).json({
			data: {
				transactionInfo,
			},
		});
	} catch (error) {
        console.log(error);
		res.status(500).json({
			data: {
				message: error,
			},
		});
	}
});
router.get('/accounts', async function(req, res, next) {
	// Todo: get AccountsList
});

router.get('/account/:address', async function(req, res, next) {
    const address = req.params.address;
	try {
		const accountInfo = await accounts.getAccountInfoByAddress(address);
		const accountTransaction = await accounts.getAccountTransactionsByAddress(address);
		const ownedNamespaceList = await namespaces.getNamespacesFromAccountByAddress(address);
		res.status(200).json({
			data: {
				accountInfo,
				accountTransaction,
				ownedNamespaceList,
			},
		});
	} catch (error) {
		res.status(500).json({
			data: {
				message: "account not found",
			},
		});
	}
});

router.get('*', async function (req, res, next) {
    res.json({
        data: {
            'msg': 'request not valid'
        },
    });
});


module.exports = router;