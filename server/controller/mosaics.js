const {
	MosaicHttp,
    MosaicId,
} = require('nem2-sdk');
const utils = require('../utils');
const endpoint = utils.getNodeEndPoint();

const mosaicHttp = new MosaicHttp(endpoint);

async function getMosaicInfoByHex(mosaicHex){
    const mosaic = new MosaicId(mosaicHex);
    const mosaicInfo = await mosaicHttp.getMosaics([mosaic]).toPromise();
    // Todo: waiting SDK fix duel rest change
    // const mosaicName = await mosaicHttp.getMosaicsNames([mosaic]).toPromise();

    return utils.formatMosaicInfo(mosaicInfo[0]);
}
module.exports = {
    getMosaicInfoByHex
}