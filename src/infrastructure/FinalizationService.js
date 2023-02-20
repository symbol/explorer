/*
 *
 * (C) Symbol Contributors 2021
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

class FinalizationService {
	/**
	 * Gets finalization proof for a given epoch.
	 * @param {number} epoch - epoch number.
	 * @returns {object} formatted finalization proof.
	 */
	static getFinalizationProofAtEpoch = async epoch => {
		const finalizationProof = await http.createRepositoryFactory
			.createFinalizationRepository()
			.getFinalizationProofAtEpoch(epoch)
			.toPromise();

		return {
			...finalizationProof,
			height: finalizationProof.height.compact()
		};
	};
}

export default FinalizationService;
