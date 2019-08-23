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