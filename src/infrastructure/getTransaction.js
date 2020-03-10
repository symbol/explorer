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
import { QueryParams, Address } from 'symbol-sdk'
import * as nem from 'symbol-sdk'
import dto from './dto'
import http from './http'
import format from '../format'
import sdkBlock from '../infrastructure/getBlock'
import sdkMosaic from './getMosaic'

class sdkTransaction {
  static getTransactionStatus = (hash) => {
    return new Promise((resolve, reject) => {
      let transactionStatus = {
        message: null,
        detail: {}
      }
      http.transaction.getTransactionStatus(hash).toPromise()
        .then(response => {
          transactionStatus.message = response.group
          transactionStatus.detail = response
          resolve(transactionStatus)
        })
        .catch(error => {
          if (error.statusCode === 404)
            reject(error)
          transactionStatus.message = error.errorDetails.message
          transactionStatus.detail = error.body
          resolve(transactionStatus)
        })
    })
  }

  static getAccountTransactions = async (address, transactionId = '') => {
    const pageSize = 100
    const transactionsList = await http.account
      .getAccountTransactions(Address.createFromRawAddress(address), new QueryParams({pageSize, id: transactionId}))
      .toPromise()

    return format.formatTransactions(transactionsList)
  }

  static getTransactionInfoByHash = async (hash) => {
    let transaction = await http.transaction.getTransaction(hash).toPromise()

    // get Mosaic Infomation
    if (transaction?.mosaics?.length) {
      // replace MosaicId when mosaic id is NamespaceId.
      await Promise.all(transaction.mosaics.map(async mosaic => {
        if (mosaic.id instanceof nem.NamespaceId)
          return (mosaic.id = await http.namespace.getLinkedMosaicId(mosaic.id).toPromise())
      }))

      const mosaicIdsList = transaction.mosaics.map(mosaicInfo => mosaicInfo.id)
      let mosaicInfoAliasNames = await sdkMosaic.getMosaicInfoAliasNames(mosaicIdsList)

      transaction.mosaics.map(mosaic => {
        mosaic.mosaicInfoAliasName = mosaicInfoAliasNames.find(mosaicInfoName => mosaicInfoName.id.equals(mosaic.id))
      })
    }

    const formattedTransaction = format.formatTransaction(transaction)
    const getBlockInfo = await sdkBlock.getBlockInfoByHeight(formattedTransaction.blockHeight)

    // Currently using maxfee in Aggregate Complete
    // http.transaction.getTransactionEffectiveFee throw error because can't get fees.
    // related issue : https://github.com/nemtech/catapult-rest/issues/242
    let effectiveFee = formattedTransaction.fee

    if (formattedTransaction.transactionBody.type !== 'Aggregate Complete') {
      const getEffectiveFee = await http.transaction.getTransactionEffectiveFee(hash).toPromise()

      effectiveFee = format.formatFee(nem.UInt64.fromNumericString(getEffectiveFee.toString()))
    }

    const transactionStatus = await http.transaction
      .getTransactionStatus(hash)
      .toPromise()

    const transactionInfo = {
      transaction: formattedTransaction,
      status: transactionStatus.status,
      confirm: transactionStatus.group,
      timestamp: getBlockInfo.date,
      fee: effectiveFee
    }

    return transactionInfo
  }

  static getTransactionsFromHashWithLimit = async (limit, transactionType, fromHash) => {
    let hash
    if (fromHash === undefined)
      hash = 'latest'
    else
      hash = fromHash

    // Get the path to the URL dependent on the config
    let path
    if (transactionType === undefined)
      path = `/transactions/from/${hash}/limit/${limit}`
    else if (transactionType === 'unconfirmed')
      path = `/transactions/unconfirmed/from/${hash}/limit/${limit}`
    else if (transactionType === 'partial')
      path = `/transactions/partial/from/${hash}/limit/${limit}`
    else {
      const array = transactionType.split('/')
      if (array.length === 1) {
        // No filter present
        path = `/transactions/from/${hash}/type/${transactionType}/limit/${limit}`
      } else {
        // We have a filter.
        path = `/transactions/from/${hash}/type/${array[0]}/filter/${array[1]}/limit/${limit}`
      }
    }

    // Make request.
    const response = await axios.get(http.nodeUrl + path)
    const transactions = response.data.map(info => dto.createTransactionFromDTO(info, http.networkType))

    return format.formatTransactions(transactions)
  }

  static getTransactionsSinceHashWithLimit = async (limit, transactionType, sinceHash) => {
    let hash
    if (sinceHash === undefined)
      hash = 'earliest'
    else
      hash = sinceHash

    let path
    if (transactionType === undefined)
      path = `/transactions/since/${hash}/limit/${limit}`
    else if (transactionType === 'unconfirmed')
      path = `/transactions/unconfirmed/since/${hash}/limit/${limit}`
    else if (transactionType === 'partial')
      path = `/transactions/partial/since/${hash}/limit/${limit}`
    else {
      const array = transactionType.split('/')
      if (array.length === 1) {
        // No filter present
        path = `/transactions/since/${hash}/type/${transactionType}/limit/${limit}`
      } else {
        // We have a filter.
        path = `/transactions/since/${hash}/type/${array[0]}/filter/${array[1]}/limit/${limit}`
      }
    }

    // Make request.
    const response = await axios.get(http.nodeUrl + path)
    const transactions = response.data.map(info => dto.createTransactionFromDTO(info, http.networkType))

    return format.formatTransactions(transactions)
  }

  static getTransactionInfoFormatted = async hash => {
    let transactionInfo
    let formattedTransactionInfo
    let transactionBody = {}
    let formattedTransactionDetail = {}
    let formattedTransferMosaics = []
    let formattedAggregateInnerTransactions = []
    let formattedAggregateCosignatures = []

    try { transactionInfo = await sdkTransaction.getTransactionInfoByHash(hash) } catch (e) { throw Error('Failed to fetch transaction info', e) }

    if (transactionInfo) {
      formattedTransactionInfo = {
        blockHeight: transactionInfo.transaction?.blockHeight,
        transactionHash: transactionInfo.transaction?.transactionHash,
        transactionId: transactionInfo.transaction?.transactionId,
        date: transactionInfo.timestamp,
        deadline: transactionInfo.transaction?.deadline,
        fee: transactionInfo.fee,
        signature: transactionInfo.transaction?.signature,
        signer: transactionInfo.transaction?.signer,
        status: transactionInfo.status,
        confirm: transactionInfo.confirm
      }

      transactionBody = transactionInfo.transaction?.transactionBody

      let { transactionType, ...detail } = transactionBody

      if (transactionBody) {
        switch (transactionType) {
        case nem.TransactionType.TRANSFER:
          formattedTransactionDetail = {
            transactionType: transactionBody.type,
            recipient: transactionBody.recipient,
            message: transactionBody.message
          }

          if (transactionBody.mosaics?.length) {
            formattedTransferMosaics = transactionBody.mosaics.map((el) => ({
              mosaicId: el.id,
              amount: el.amount,
              mosaicAliasName: el.mosaicAliasName
            }))
          }
          break

        case nem.TransactionType.NAMESPACE_REGISTRATION:
        case nem.TransactionType.ADDRESS_ALIAS:
        case nem.TransactionType.MOSAIC_ALIAS:
        case nem.TransactionType.MOSAIC_DEFINITION:
        case nem.TransactionType.MOSAIC_SUPPLY_CHANGE:
        case nem.TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
        case nem.TransactionType.HASH_LOCK:
        case nem.TransactionType.SECRET_LOCK:
        case nem.TransactionType.SECRET_PROOF:
        case nem.TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
        case nem.TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
        case nem.TransactionType.ACCOUNT_OPERATION_RESTRICTION:
        case nem.TransactionType.ACCOUNT_LINK:
        case nem.TransactionType.MOSAIC_ADDRESS_RESTRICTION:
        case nem.TransactionType.MOSAIC_GLOBAL_RESTRICTION:
        case nem.TransactionType.ACCOUNT_METADATA:
        case nem.TransactionType.MOSAIC_METADATA:
        case nem.TransactionType.NAMESPACE_METADATA:
          formattedTransactionDetail = detail

          break

        case nem.TransactionType.AGGREGATE_COMPLETE:
          formattedTransactionDetail = {
            transactionType: transactionBody.type
          }

          if (transactionBody.innerTransactions?.length) {
            formattedAggregateInnerTransactions = transactionBody.innerTransactions.map((el) => ({
              transactionId: el.transactionId,
              type: el.transactionBody.type,
              signer: el.signer,
              transactionBody: el.transactionBody
            }))
          }

          if (transactionBody.cosignatures?.length) {
            formattedAggregateCosignatures = transactionBody.cosignatures.map((el) => ({
              signature: el.signature,
              signer: el.signer
            }))
          }

          break

        case nem.TransactionType.AGGREGATE_BONDED:
          formattedTransactionDetail = {
            transactionType: transactionBody.type
          }

          if (transactionBody.innerTransactions?.length) {
            formattedAggregateInnerTransactions = transactionBody.innerTransactions.map((el) => ({
              transactionId: el.transactionId,
              type: el.transactionBody.type,
              signer: el.signer,
              transactionBody: el.transactionBody
            }))
          }

          if (transactionBody.cosignatures?.length) {
            formattedAggregateCosignatures = transactionBody.cosignatures.map((el) => ({
              signature: el.signature,
              signer: el.signer
            }))
          }

          break
        default:
          break
        }
      }
    }
    return {
      transactionInfo: formattedTransactionInfo || {},
      transactionBody: transactionBody || {},
      transactionDetail: formattedTransactionDetail || {},
      transferMosaics: formattedTransferMosaics || [],
      aggregateInnerTransactions: formattedAggregateInnerTransactions || [],
      aggregateCosignatures: formattedAggregateCosignatures || []
    }
  }
}

export default sdkTransaction
