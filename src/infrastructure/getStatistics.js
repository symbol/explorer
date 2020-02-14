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
  const maxRollBackBlocksFeeMultipliers = maxRollBackBlocks.map(({ feeMultiplier }) => (feeMultiplier / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)))

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
  const maxDifficultyBlocksFeeMultipliers = maxDifficultyBlocks.map(({ feeMultiplier }) => (feeMultiplier / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)) > 0 ? (feeMultiplier / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)) : defaultDynamicFees)

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

export const getBlockTimeDifferenceData = async () => {
  const blockCount = 240 // 1 hours
  const grouping = 60 // 15 mins
  const startHeight = await sdkBlock.getBlockHeight() - blockCount

  const blocks = await sdkDiagnostic.getDiagnosticBlocksFromHeightWithLimit(blockCount, startHeight)

  let blockTimeDifferenceGraphDataset = drawBlockTimeDifference(blocks, grouping)

  let transactionPerBlockGraphDataset = drawTransactionPerBlock(blocks, grouping)

  return {
    blockTimeDifferenceGraphDataset,
    transactionPerBlockGraphDataset
  }
}

const drawBlockTimeDifference = (blocks, grouping) => {
  const heights = blocks.map(block => block.height.compact())
  let timestamps = blocks.map(block => block.timestamp.compact())

  for (let i = 0; i < timestamps.length - 1; ++i)
    timestamps[i] -= timestamps[i + 1]

  let averages = []
  let sum = 0
  for (let i = 0; i < grouping; ++i)
    sum += timestamps[i]

  for (let i = grouping; i < timestamps.length; ++i) {
    averages.push(sum / grouping)
    sum -= timestamps[i - grouping]
    sum += timestamps[i]
  }
  averages.push(0)

  let timeDifferenceDataset = []
  let averagesDataset = []
  for (let i = 0; i < timestamps.length - 1; ++i) {
    timeDifferenceDataset.push([heights[i], timestamps[i] / 1000])
    averagesDataset.push([heights[i], (averages[i] / 1000).toFixed(3)])
  }

  return [
    {
      name: 'Time Difference (in seconds)',
      type: 'line',
      data: timeDifferenceDataset
    },
    {
      name: 'Average Time Difference (per 60 blocks)',
      type: 'line',
      data: averagesDataset
    }
  ]
}

const drawTransactionPerBlock = (blocks, grouping) => {
  const heights = blocks.map(block => block.height.compact())
  let numTransactions = blocks.map(block => block.numTransactions)

  let averages = []
  let sum = 0
  for (let i = 0; i < grouping; ++i)
    sum += numTransactions[i]

  for (let i = grouping; i < numTransactions.length; ++i) {
    averages.push(sum / grouping)
    sum -= numTransactions[i - grouping]
    sum += numTransactions[i]
  }
  averages.push(0)

  let numTransactionsPerBlockDataset = []
  let averagesDataset = []
  for (let i = 0; i < numTransactions.length - 1; ++i) {
    numTransactionsPerBlockDataset.push([heights[i], numTransactions[i]])
    averagesDataset.push([heights[i], Math.floor(averages[i])])
  }

  return [
    {
      name: 'Number of transactions',
      type: 'column',
      data: numTransactionsPerBlockDataset
    },
    {
      name: 'Average number of transaction (per 60 blocks)',
      type: 'line',
      data: averagesDataset
    }
  ]
}
