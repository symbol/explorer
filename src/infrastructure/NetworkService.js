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

class NetworkService {
	/**
	 * Get estimated effective rental fees for namespaces and mosaics.
	 * @returns {object} rental fees information
	 */
	static getRentalFees = async () => {
		const rentalFees = await http.createRepositoryFactory
			.createNetworkRepository()
			.getRentalFees()
			.toPromise();

		return this.formatRentalFees(rentalFees);
	};

	/**
	 * Get average, median, highest and lower fee multiplier over the last "numBlocksTransactionFeeStats".
	 * @returns {object} transaction fees information
	 */
	static getTransactionFees = async () => {
		const transactionFees = await http.createRepositoryFactory
			.createNetworkRepository()
			.getTransactionFees()
			.toPromise();

		return transactionFees;
	};

	/**
	 * Formatted Transaction Fees multiplier into Vue Component.
	 * @returns {object} Transaction Fees Info for Vue Component.
	 */
	static getTransactionFeesInfo = async () => {
		const transactionFees = await this.getTransactionFees();

		return transactionFees;
	};

	/**
	 * Formatted Rental Fees into Vue Component.
	 * @returns {object} Rental Fees Info for Vue Component.
	 */
	static getRentalFeesInfo = async () => {
		const rentalFees = await this.getRentalFees();

		return rentalFees;
	};

	/**
	 * Format RentalfeesDTO to readable object.
	 * @param {object} rentalFees rental fees.
	 * @returns {object} readable RentalfeesDTO object.
	 */
	static formatRentalFees = rentalFees => {
		const { divisibility } = http.networkCurrency;

		return {
			effectiveRootNamespaceRentalFeePerBlock:
				rentalFees.effectiveRootNamespaceRentalFeePerBlock /
				Math.pow(10, divisibility),
			effectiveChildNamespaceRentalFee:
				rentalFees.effectiveChildNamespaceRentalFee /
				Math.pow(10, divisibility),
			effectiveMosaicRentalFee:
				rentalFees.effectiveMosaicRentalFee / Math.pow(10, divisibility)
		};
	};
}

export default NetworkService;
