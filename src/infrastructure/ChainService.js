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

import http from './http';

class ChainService {
	/**
	 * Gets chain info such as current block height, finalized block and etc
	 * @returns {object} formatted chain info
	 */
	static getChainInfo = async () => {
		const chainInfo = await http.createRepositoryFactory
			.createChainRepository()
			.getChainInfo()
			.toPromise();

		return {
			...chainInfo,
			height: chainInfo.height.compact(),
			latestFinalizedBlock: {
				...chainInfo.latestFinalizedBlock,
				height: chainInfo.latestFinalizedBlock.height.compact()
			}
		};
	};
}

export default ChainService;
