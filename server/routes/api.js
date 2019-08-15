var express = require('express');
var router = express.Router();
const { homeInfo, blocks } = require('../controller/index');

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
    if (req.query.fromblock == undefined) {
        let ht = await blocks.getBlockHeight();
        const blockList = await blocks.getBlocksWithLimit(20, ht);
        res.json({
            data: {
                hight: ht,
                blockList,
            },
        });
    } else if (req.query.fromblock) {
        console.log(req.query.fromblock)
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


router.get('*', async function (req, res, next) {
    res.json({
        data: {
            'msg': 'request not valid'
        },
    });
});


module.exports = router;