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
import Constants from '../config/constants'

const getAverageNetworkFees = async () => {
  const maxDifficultyBlocks = await sdkBlock.getBlocksFromHeightWithLimit(Constants.NetworkConfig.MAX_DIFFICULTY_BLOCKS)
  const maxDifficultyBlocksFeeMultipliers = maxDifficultyBlocks.map(({ feeMultiplier }) => parseFloat(feeMultiplier) > 0 ? parseFloat(feeMultiplier) : Constants.NetworkConfig.DEFAULT_DYNAMIC_FEE_MULTIPLIER / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY))
  const averageNetworkFees = maxDifficultyBlocksFeeMultipliers.reduce((prev, curr) => prev + curr, 0) / maxDifficultyBlocksFeeMultipliers.length

  return averageNetworkFees
}

export const getNetworkTransactionFees = async () => {
  const averageNetworkFees = await getAverageNetworkFees()
  return Constants.NetworkConfig.NETWORK_FEES_RATE.map(feeRate => ({
    netoworkFeesType: feeRate.TYPE,
    fees: (feeRate.RATE * averageNetworkFees).toFixed(Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
    remark: 'XEM / Transfer'
  }))
}

export const getEffectiveRentalFees = async () => {
  const averageNetworkFees = await getAverageNetworkFees()
  return Constants.NetworkConfig.NETWORK_RENTAL_RATE.map(feeRate => ({
    netoworkFeesType: feeRate.TYPE,
    fees: (feeRate.RATE * averageNetworkFees).toFixed(Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
    remark: '/ Block'
  }))
}
