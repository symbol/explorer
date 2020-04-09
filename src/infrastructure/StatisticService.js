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

import sdkBlock from './getBlock'

class StatisticService {
  /**
   * Gets Block Time Difference dataset.
   * The dataset in use for Chart.
   * @param limit - number of the block.
   * @param grouping - grouping block for calculation
   * @returns block time difference dataset.
   */
  static getBlockTimeDifferenceData = async (limit, grouping) => {
    let blocks = await sdkBlock.getBlocksFromHeightWithLimit(limit)

    const heights = blocks.map(data => Number(data.height))
    let timestamps = blocks.map(data => data.timestamp)

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

    let dataset = [
      {
        name: 'Time Difference (in seconds)',
        data: timeDifferenceDataset
      },
      {
        name: `Average Time Difference (per ${grouping} blocks)`,
        data: averagesDataset
      }
    ]

    return {
      limit: limit,
      grouping: grouping,
      name: `Block time differences in last ${limit} blocks`,
      data: dataset
    }
  }

  /**
   * Gets Transaction data per block dataset
   * The dataset in use for Chart.
   * @param limit - number of the block.
   * @param grouping - grouping block for calculation
   * @returns transaction data per block dataset.
   */
  static getTransactionPerBlockData = async (limit, grouping) => {
    let blocks = await sdkBlock.getBlocksFromHeightWithLimit(limit)

    const heights = blocks.map(data => Number(data.height))
    let numTransactions = blocks.map(data => data.numTransactions)

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

    let dataset = [
      {
        name: 'Number of transactions',
        data: numTransactionsPerBlockDataset
      },
      {
        name: `Average number of transaction (per ${grouping} blocks)`,
        data: averagesDataset
      }
    ]

    return {
      limit: limit,
      grouping: grouping,
      name: `Transaction per block in last ${limit} blocks`,
      data: dataset
    }
  }
}

export default StatisticService
