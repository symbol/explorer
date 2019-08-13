var express = require('express');
var router = express.Router();
const { homeInfo, blocks } = require('../controller/index');

router.get('/homeInfo', async function (req, res, next) {
    // Todo: Average block time
    let marketData = await homeInfo.getMarketData();
    let chainInfo = await homeInfo.getChainInfo();
    let recentBlocks = await blocks.getBlocksWithLimit(4 );
    res.json({
        marketData,
        chainInfo,
        recentBlocks
    });
});
module.exports = router;