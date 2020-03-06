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

import axios from 'axios'
import http from './http'
import sdkBlock from '../infrastructure/getBlock'
import sdkDiagnostic from '../infrastructure/getDiagnostic'
import Constants from '../config/constants'
import helper from '../helper'

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

  const path = `/network/fees`
  const response = await axios.get(http.nodeUrl + path)
  const networkFees = response.data

  const feeType = Object.keys(networkFees)

  let networkTransactionFees = []
  feeType.forEach(type => {
    let fees = 0
    if (type === 'highestFeeMultiplier')
      fees = networkFees.highestFeeMultiplier
    if (type === 'averageFeeMultiplier')
      fees = networkFees.averageFeeMultiplier
    if (type === 'medianFeeMultiplier')
      fees = networkFees.medianFeeMultiplier
    if (type === 'lowestFeeMultiplier')
      fees = networkFees.lowestFeeMultiplier

    networkTransactionFees.push({
      netoworkFeesType: type,
      fees: fees.toString()
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

export const getBlockTimeDifferenceData = async (limit, grouping) => {
  const path = `stat/blockTimeDifference/limit/${limit}/grouping/${grouping}`
  const response = await axios.get(http.analysisDataUrl + path)
  const dataset = response.data

  let chartData = [
    {
      name: dataset.data[0].name,
      type: 'line',
      data: dataset.data[0].data
    },
    {
      name: dataset.data[1].name,
      type: 'line',
      data: dataset.data[1].data
    }
  ]

  return {
    ...dataset,
    chartData
  }
}

export const getTransactionPerBlockData = async (limit, grouping) => {
  const path = `stat/transactionPerBlock/limit/${limit}/grouping/${grouping}`
  const response = await axios.get(http.analysisDataUrl + path)
  const dataset = response.data

  let chartData = [
    {
      name: dataset.data[0].name,
      type: 'column',
      data: dataset.data[0].data
    },
    {
      name: dataset.data[1].name,
      type: 'line',
      data: dataset.data[1].data
    }
  ]

  return {
    ...dataset,
    chartData
  }
}

export const getTransactionPerDayData = async (days) => {
  const path = `stat/transactionPerDay/days/${days}`
  const response = await axios.get(http.analysisDataUrl + path)
  const dataset = response.data

  let chartData = [{
    name: 'Transaction Per day',
    type: 'column',
    data: dataset.data
  }]

  console.log(chartData)

  return {
    ...dataset,
    chartData
  }
}
