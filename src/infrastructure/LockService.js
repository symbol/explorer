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
import { Constants } from '../config';

class LockService {
    /**
     * Gets a hash lock from searchCriteria.
     * @param {object} hashLockSearchCriteria Search Criteria.
     * @returns {object} formatted hash lock data with pagination info.
     */
    static searchHashLocks = async hashLockSearchCriteria => {
    	const searchHashLocks = await http.createRepositoryFactory.createHashLockRepository()
  		.search(hashLockSearchCriteria)
    		.toPromise();

    	return {
    		...searchHashLocks,
    		data: searchHashLocks.data.map(hashLock => this.formatHashLockInfo(hashLock))
    	};
    }

    /**
     * Gets hash lock from hash.
     * @param {string} hash Transaction hash.
     * @returns {object}formatted Hash lock info.
     */
    static getHashLock = async hash => {
    	const hashLock = await http.createRepositoryFactory.createHashLockRepository()
    		.getHashLock(hash)
    		.toPromise();

    	return this.formatHashLockInfo(hashLock);
    }

    /**
     * Gets a secret lock from searchCriteria.
     * @param {object} secretLockSearchCriteria Search Criteria.
     * @returns {object} formatted secret lock data with pagination info.
     */
    static searchSecretLocks = async secretLockSearchCriteria => {
    	const searchSecretLocks = await http.createRepositoryFactory.createSecretLockRepository()
  		.search(secretLockSearchCriteria)
    		.toPromise();

    	return {
    		...searchSecretLocks,
    		data: searchSecretLocks.data.map(hashLock => this.formatSecretLockInfo(hashLock))
    	};
    }

    /**
     * Format secretLockInfoDTO.
     * @param {object} secretLockInfo secretLockInfoDTO.
     * @returns {object} readable secretLockInfoDTO object.
     */
    static formatSecretLockInfo = secretLockInfo => ({
    	...secretLockInfo,
    	status: Constants.LockStatusType[secretLockInfo.status],
    	endHeight: Number(secretLockInfo.endHeight.toString()),
    	ownerAddress: secretLockInfo.ownerAddress.plain(),
    	recipient: secretLockInfo.recipientAddress.plain(),
    	hashAlgorithm: Constants.LockHashAlgorithm[secretLockInfo.hashAlgorithm]
    })

    /**
     * Format HashLockInfoDTO
     * @param {object} hashLockInfo hashLockInfoDTO.
     * @returns {object} readable HashLockInfoDTO object
     */
    static formatHashLockInfo = hashLockInfo => ({
    	...hashLockInfo,
    	status: Constants.LockStatusType[hashLockInfo.status],
    	endHeight: Number(hashLockInfo.endHeight.toString()),
    	ownerAddress: hashLockInfo.ownerAddress.plain()
    })
}

export default LockService;
