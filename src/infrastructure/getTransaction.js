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
// import { QueryParams, Address } from 'nem2-sdk'
import * as nem from 'nem2-sdk'
import dto from './dto'
import http from './http'
import format from '../format'
import sdkBlock from '../infrastructure/getBlock'
const QueryParams = nem.QueryParams // Travis patch
const Address = nem.Address // Travis patch

class sdkTransaction {
  static getAccountTransactions = async (address, transactionId = '') => {
    let pageSize = 100

    const transactionsList = await http.account
    .getAccountTransactions(Address.createFromRawAddress(address), new QueryParams(pageSize, transactionId))
    .toPromise()

    return format.formatTransactions(transactionsList)
  }

  static getTransactionInfoByHash = async (hash) => {
    const transaction = await http.transaction.getTransaction(hash).toPromise()
    const effectiveFee = await http.transaction.getTransactionEffectiveFee(hash).toPromise()
    const formattedTransaction = format.formatTransaction(transaction)
    const getBlockInfo = await sdkBlock.getBlockInfoByHeight(formattedTransaction.blockHeight)

    const transactionStatus = await http.transaction
      .getTransactionStatus(hash)
      .toPromise()

    const transactionInfo = {
      transaction: formattedTransaction,
      status: transactionStatus.status,
      confirm: transactionStatus.group,
      timestamp: getBlockInfo.date,
      fee: format.formatFee(nem.UInt64.fromNumericString(effectiveFee.toString()))
    }

    return transactionInfo
  }

  static getTransactionsFromHashWithLimit = async (limit, transactionType, fromHash) => {
    let hash
    if (fromHash === undefined) {
      hash = 'latest'
    } else {
      hash = fromHash
    }

    // Get the path to the URL dependent on the config
    let path
    if (transactionType === undefined) {
      path = `/transactions/from/${hash}/limit/${limit}`
    } else if (transactionType === 'unconfirmed') {
      path = `/transactions/unconfirmed/from/${hash}/limit/${limit}`
    } else if (transactionType === 'partial') {
      path = `/transactions/partial/from/${hash}/limit/${limit}`
    } else {
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
    if (sinceHash === undefined) {
      hash = 'earliest'
    } else {
      hash = sinceHash
    }

    let path
    if (transactionType === undefined) {
      path = `/transactions/since/${hash}/limit/${limit}`
    } else if (transactionType === 'unconfirmed') {
      path = `/transactions/unconfirmed/since/${hash}/limit/${limit}`
    } else if (transactionType === 'partial') {
      path = `/transactions/partial/since/${hash}/limit/${limit}`
    } else {
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

      if (transactionBody) {
        switch (transactionBody.transactionType) {
          case nem.TransactionType.TRANSFER:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              recipient: transactionBody.recipient,
              message: transactionBody.message
            }

            if (transactionBody.mosaics?.length) {
              formattedTransferMosaics = transactionBody.mosaics.map((el) => ({
                mosaicId: el.id,
                amount: el.amount
              }))
            }
            break

          case nem.TransactionType.REGISTER_NAMESPACE:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              recipient: transactionBody.recipient,
              registrationType: transactionBody.registrationType,
              namespaceName: transactionBody.namespaceName,
              namespaceId: transactionBody.namespaceId,
              parentId: transactionBody.parentId,
              duration: transactionBody.duration
            }
            break

          case nem.TransactionType.ADDRESS_ALIAS:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              aliasAction: transactionBody.aliasAction,
              namespaceId: transactionBody.namespaceId
            }
            break

          case nem.TransactionType.MOSAIC_ALIAS:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              aliasAction: transactionBody.aliasAction,
              namespaceId: transactionBody.namespaceId,
              mosaicId: transactionBody.mosaicId
            }
            break

          case nem.TransactionType.MOSAIC_DEFINITION:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              recipient: transactionBody.recipient,
              mosaicId: transactionBody.mosaicId,
              divisibility: transactionBody.divisibility,
              duration: transactionBody.duration,
              nonce: transactionBody.nonce,
              supplyMutable: transactionBody.supplyMutable,
              transferable: transactionBody.transferable,
              restrictable: transactionBody.restrictable
            }
            break

          case nem.TransactionType.MOSAIC_SUPPLY_CHANGE:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              mosaicId: transactionBody.mosaicId,
              action: transactionBody.action,
              delta: transactionBody.delta
            }
            break

          case nem.TransactionType.MODIFY_MULTISIG_ACCOUNT:
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
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

          case nem.TransactionType.LOCK:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              duration: transactionBody.duration,
              mosaicId: transactionBody.mosaicId,
              amount: transactionBody.amount
            }
            break

          case nem.TransactionType.SECRET_LOCK:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              duration: transactionBody.duration,
              mosaicId: transactionBody.mosaicId,
              secret: transactionBody.secret,
              recipient: transactionBody.recipient,
              hashType: transactionBody.hashType
            }
            break

          case nem.TransactionType.SECRET_PROOF:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            // Todo: Anthony
            formattedTransactionDetail = {
              transactionType: transactionBody.type
            }
            break

          case nem.TransactionType.LINK_ACCOUNT:
            formattedTransactionDetail = {
              transactionType: transactionBody.type,
              linkAction: transactionBody.linkAction,
              remoteAccountPublicKey: transactionBody.remoteAccountPublicKey,
              remoteAccountAddress: transactionBody.remoteAccountAddress
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
