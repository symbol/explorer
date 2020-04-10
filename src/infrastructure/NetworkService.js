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

import * as symbol from 'symbol-sdk'
import Constants from '../config/constants'

class NetworkService {
  /**
   * Get estimated effective rental fees for namespaces and mosaics
   * @returns rental fees information
   */
  static getRentalFees = async () => {
    // Todo: Remove hardcore URL, After all, restVersion is 1.0.20.24 above
    const rentalFees = await new symbol.NetworkHttp('http://oleg-test-01.eu-west-1.symboldev.network:3000').getRentalFees().toPromise()
    return this.formatRentalFees(rentalFees)
  }

  /**
   * Get average, median, highest and lower fee multiplier over the last "numBlocksTransactionFeeStats".
   * @returns transaction fees information
   */
  static getTransactionFees = async () => {
    // Todo: Remove hardcore URL, After all, restVersion is 1.0.20.24 above
    const transactionFees = await new symbol.NetworkHttp('http://oleg-test-01.eu-west-1.symboldev.network:3000').getTransactionFees().toPromise()
    return transactionFees
  }

  /**
   * Formatted Transaction Fees multipler into Vue Component
   * @returns Transaction Fees Info for Vue Component
   */
  static getTransactionFeesInfo = async () => {
    const transactionFees = await this.getTransactionFees()
    return transactionFees
  }

  /**
   * Formatted Rental Fees into Vue Component
   * @returns Rental Fees Info for Vue Component
   */
  static getRentalFeesInfo = async () => {
    const rentalFees = await this.getRentalFees()
    return rentalFees
  }

  /**
   * Format RentalfeesDTO to readable object
   * @returns readable RentalfeesDTO object
   */
  static formatRentalFees = rentalFees => ({
    effectiveRootNamespaceRentalFeePerBlock: rentalFees.effectiveRootNamespaceRentalFeePerBlock / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
    effectiveChildNamespaceRentalFee: rentalFees.effectiveChildNamespaceRentalFee / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
    effectiveMosaicRentalFee: rentalFees.effectiveMosaicRentalFee / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)
  })
}

export default NetworkService
