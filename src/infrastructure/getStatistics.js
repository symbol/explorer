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

import sdkBlock from '../infrastructure/getBlock'
import sdkDiagnostic from '../infrastructure/getDiagnostic'
import Constants from '../config/constants'
import helper from '../helper'

const getNetworkFees = async () => {
  const fromHeight = await sdkBlock.getBlockHeight() - Constants.NetworkConfig.MAX_ROLL_BACK_BLOCKS
  const maxRollBackBlocks = await sdkDiagnostic.getDiagnosticBlocksFromHeightWithLimit(Constants.NetworkConfig.MAX_ROLL_BACK_BLOCKS, fromHeight)
  const maxRollBackBlocksFeeMultipliers = maxRollBackBlocks.map(({ feeMultiplier }) => parseFloat(feeMultiplier))

  return {
    averageNetworkFees: helper.calculateAverage(maxRollBackBlocksFeeMultipliers),
    medianNetworkFees: helper.calculateMedian(maxRollBackBlocksFeeMultipliers),
    highestNetworkFees: Math.max(...maxRollBackBlocksFeeMultipliers),
    lowestNetworkFees: Math.max(...maxRollBackBlocksFeeMultipliers)
  }
}

const getRentalFees = async () => {
  const defaultDynamicFees = Constants.NetworkConfig.DEFAULT_DYNAMIC_FEE_MULTIPLIER / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)
  const fromHeight = await sdkBlock.getBlockHeight() - Constants.NetworkConfig.MAX_DIFFICULTY_BLOCKS
  const maxDifficultyBlocks = await sdkDiagnostic.getDiagnosticBlocksFromHeightWithLimit(Constants.NetworkConfig.MAX_DIFFICULTY_BLOCKS, fromHeight)
  const maxDifficultyBlocksFeeMultipliers = maxDifficultyBlocks.map(({ feeMultiplier }) => parseFloat(feeMultiplier) > 0 ? parseFloat(feeMultiplier) : defaultDynamicFees)

  return {
    medianNetworkMultiplier: helper.calculateMedian(maxDifficultyBlocksFeeMultipliers)
  }
}

export const getNetworkTransactionFees = async () => {
  const networkFees = await getNetworkFees()
  let networkTransactionFees = []
  Constants.NetworkConfig.NETWORK_FEES_RATE.forEach(feeRate => {
    let fees = 0
    if (feeRate.TYPE === 'Fast')
      fees = (feeRate.RATE * networkFees.highestNetworkFees)
    if (feeRate.TYPE === 'Average')
      fees = (feeRate.RATE * networkFees.averageNetworkFees)
    if (feeRate.TYPE === 'Slow')
      fees = (feeRate.RATE * networkFees.lowestNetworkFees)

    networkTransactionFees.push({
      netoworkFeesType: feeRate.TYPE,
      fees: fees.toFixed(Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
      remark: Constants.NetworkConfig.NAMESPACE[1].split('.')[1] + ' / Transfer'
    })
  })

  return networkTransactionFees
}

export const getEffectiveRentalFees = async () => {
  const rentalFees = await getRentalFees()
  return Constants.NetworkConfig.NETWORK_RENTAL_RATE.map(feeRate => ({
    netoworkFeesType: feeRate.TYPE,
    fees: (feeRate.RATE * rentalFees.medianNetworkMultiplier).toFixed(Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
    remark: '/ Block'
  }))
}
