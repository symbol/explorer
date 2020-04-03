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

import { TransactionType, Address, TransactionInfo, AggregateTransactionInfo, NamespaceId, UInt64 } from 'symbol-sdk'
import Constants from '../config/constants'
import http from './http'
import format from '../format'
import moment from 'moment'
import { BlockService } from '../infrastructure'

class TransactionService {
  /**
   * Gets a transaction status for a transaction hash
   * @param hash Transaction id or hash
   * @returns TransactionStatus object
   */
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

  /**
   * Gets a transaction from hash or transaction Id
   * @param hash Transaction id or hash
   * @returns formatted Transaction
   */
  static getTransaction = async (hash) => {
    let transaction = await http.transaction.getTransaction(hash).toPromise()
    return this.formatTransaction(transaction)
  }

  /**
   * Gets a transaction's effective paid fee
   * @param hash Transaction id or hash
   * @returns formatted effectiveFee string
   */
  static getTransactionEffectiveFee = async (hash) => {
    let effectiveFee = await http.transaction.getTransactionEffectiveFee(hash).toPromise()
    return format.toNetworkCurrency(effectiveFee)
  }

  /**
   * Gets Formatted Transaction Info for Vue component
   * @param hash Transaction id or hash
   * @returns Custom Transaction object
   */
  static getTransactionInfo = async hash => {
    let formattedTransaction = await this.getTransaction(hash)

    let { date } = await BlockService.getBlockInfo(formattedTransaction.transactionInfo.height)
    let effectiveFee = await this.getTransactionEffectiveFee(hash)
    const transactionStatus = await this.getTransactionStatus(hash)

    formattedTransaction.effectiveFee = effectiveFee
    formattedTransaction.date = date

    // Todo - Get mosaic detail by mosaics

    const transactionInfo = {
      transaction: formattedTransaction,
      status: transactionStatus.detail.code,
      confirm: transactionStatus.message,
    }

    return transactionInfo
  }

  /**
   * Format Transaction
   * @param transactionDTO
   * @returns readable transactionDTO object
   */
  static formatTransaction = transaction => ({
    ...transaction,
    deadline: moment.utc(new Date(transaction.deadline.value)).local().format(
      'YYYY-MM-DD HH:mm:ss'
    ),
    maxFee: format.toNetworkCurrency(transaction.maxFee),
    signer: transaction.signer.address.plain(),
    transactionInfo: this.formatTransactionInfo(transaction.transactionInfo),
    transactionBody: this.formatTransactionBody(transaction)
  })

  /**
   * Format recipientAddressDTO
   * @param recipientAddressDTO
   * @returns NamespaceId.full | address
   */
  static formatRecipientAddress = recipientAddress => {
    if (recipientAddress instanceof NamespaceId) {
      return recipientAddress.fullName | recipientAddress.id.toHex()
    }
    return recipientAddress.address
  }

  /**
   * Format Different Type of Transaction such as TransferTransaction
   * @param TransactionDTO
   * @returns readable TransactionBody object
   */
  static formatTransactionBody = transactionBody => {
    switch (transactionBody.type) {
    case TransactionType.TRANSFER:
      return {
        type: Constants.TransactionType[TransactionType.TRANSFER],
        recipient: this.formatRecipientAddress(transactionBody.recipientAddress),
        mosaics: transactionBody.mosaics.map(mosaic => ({ // Todo Format mosaic
          ...mosaic,
          id: mosaic.id.toHex(),
          amount: mosaic.amount.compact().toString()
        })),
        message: transactionBody.message.payload
      }

    case TransactionType.NAMESPACE_REGISTRATION:
      let parentIdHex = transactionBody.parentId ? transactionBody.parentId.toHex() : ''
      let duration = transactionBody.duration ? transactionBody.duration.compact() : 0

      return {
        type: Constants.TransactionType[TransactionType.NAMESPACE_REGISTRATION],
        recipient: Address.createFromPublicKey(Constants.NetworkConfig.NAMESPACE_RENTAL_FEE_SINK_PUBLIC_KEY, http.networkType).plain(),
        registrationType: Constants.NamespaceRegistrationType[transactionBody.registrationType],
        namespaceName: transactionBody.namespaceName,
        namespaceId: transactionBody.namespaceId.toHex(),
        parentId: parentIdHex === '' ? Constants.Message.UNAVAILABLE : parentIdHex,
        duration: duration === 0 ? Constants.Message.UNLIMITED : duration
      }

    case TransactionType.ADDRESS_ALIAS:
      return {
        type: Constants.TransactionType[TransactionType.ADDRESS_ALIAS],
        aliasAction: Constants.AliasAction[transactionBody.aliasAction],
        namespaceId: transactionBody.namespaceId.toHex(),
        namespaceFullName: transactionBody.namespaceId.fullName
      }

    case TransactionType.MOSAIC_ALIAS:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_ALIAS],
        aliasAction: Constants.AliasAction[transactionBody.aliasAction],
        namespaceId: transactionBody.namespaceId.id.toHex(),
        namespaceFullName: transactionBody.namespaceId.fullName,
        mosaicId: transactionBody.mosaicId.id.toHex()
      }

    case TransactionType.MOSAIC_DEFINITION:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_DEFINITION],
        recipient: Address.createFromPublicKey(Constants.NetworkConfig.MOSAIC_RENTAL_FEE_SINK_PUBLIC_KEY, http.networkType).plain(),
        mosaicId: transactionBody.mosaicId.toHex(),
        divisibility: transactionBody.divisibility,
        duration: transactionBody.duration.compact(),
        nonce: transactionBody.nonce,
        supplyMutable: transactionBody.flags.supplyMutable,
        transferable: transactionBody.flags.transferable,
        restrictable: transactionBody.flags.restrictable
      }

    case TransactionType.MOSAIC_SUPPLY_CHANGE:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_SUPPLY_CHANGE],
        mosaicId: transactionBody.mosaicId.id.toHex(),
        action: Constants.MosaicSupplyChangeAction[transactionBody.action],
        delta: transactionBody.delta.compact()
      }

    case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
      return {
        type: Constants.TransactionType[TransactionType.MULTISIG_ACCOUNT_MODIFICATION],
        minApprovalDelta: transactionBody.minApprovalDelta,
        minRemovalDelta: transactionBody.minRemovalDelta,
        publicKeyAdditions: transactionBody.publicKeyAdditions(publicKey => publicKey.address.address),
        publicKeyDeletions: transactionBody.publicKeyDeletions(publicKey => publicKey.address.address),
      }

    case TransactionType.AGGREGATE_COMPLETE:
      return {
        type: Constants.TransactionType[TransactionType.AGGREGATE_COMPLETE],
        innerTransactions: transactionBody.innerTransactions.map(transaction => this.formatTransaction(transaction)),
        cosignatures: transactionBody.cosignatures.map(cosigner => cosigner.signer.address.address)
      }

    case TransactionType.AGGREGATE_BONDED:
      return {
        type: Constants.TransactionType[TransactionType.AGGREGATE_BONDED],
        innerTransactions: transactionBody.innerTransactions.map(transaction => this.formatTransaction(transaction)),
        cosignatures: transactionBody.cosignatures.map(cosigner => cosigner.signer.address.address)
      }

    case TransactionType.HASH_LOCK:
      return {
        type: Constants.TransactionType[TransactionType.HASH_LOCK],
        duration: transactionBody.duration.compact(),
        mosaicId: transactionBody.mosaic.id.toHex(), // Todo Format Mosaic
        amount: format.formatFee(transactionBody.mosaic.amount)
      }

    case TransactionType.SECRET_LOCK:
      return {
        type: Constants.TransactionType[TransactionType.SECRET_LOCK],
        duration: transactionBody.duration.compact(),
        mosaicId: transactionBody.mosaic.id.toHex(), // Todo Format Mosaic
        secret: transactionBody.secret,
        recipient: this.formatRecipientAddress(transactionBody.recipientAddress),
        hashType: Constants.HashType[transactionBody.hashType]
      }

    case TransactionType.SECRET_PROOF:
      return {
        type: Constants.TransactionType[TransactionType.SECRET_PROOF],
        hashType: Constants.HashType[transactionBody.hashType],
        recipient: this.formatRecipientAddress(transactionBody.recipientAddress),
        secret: transactionBody.secret,
        proof: transactionBody.proof
      }
    case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
      return {
        type: Constants.TransactionType[TransactionType.ACCOUNT_ADDRESS_RESTRICTION],
        restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
        restrictionAddressAdditions: transactionBody.restrictionAdditions.map(restriction => {
          if (restriction instanceof Address)
            return restriction.address

          return restriction.fullName
        }),
        restrictionAddressDeletions: transactionBody.restrictionDeletions.map(restriction => {
          if (restriction instanceof Address)
            return restriction.address

          return restriction.fullName
        })
      }

    case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
      return {
        type: Constants.TransactionType[TransactionType.ACCOUNT_MOSAIC_RESTRICTION],
        restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
        restrictionMosaicAdditions: transactionBody.restrictionAdditions.map(mosaic => mosaic.id.toHex()),
        restrictionMosaicDeletions: transactionBody.restrictionDeletions.map(mosaic => mosaic.id.toHex())
      }

    case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
      return {
        type: Constants.TransactionType[TransactionType.ACCOUNT_OPERATION_RESTRICTION],
        restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
        restrictionOperationAdditions: transactionBody.restrictionAdditions.map(operation => Constants.TransactionType[operation]),
        restrictionOperationDeletions: transactionBody.restrictionDeletions.map(operation => Constants.TransactionType[operation])
      }

    case TransactionType.ACCOUNT_LINK:
      return {
        type: Constants.TransactionType[TransactionType.ACCOUNT_LINK],
        linkAction: Constants.LinkAction[transactionBody.linkAction],
        remotePublicKey: transactionBody.remotePublicKey,
        remoteAccountAddress: Address.createFromPublicKey(transactionBody.remotePublicKey, http.networkType).plain()
      }

    case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_ADDRESS_RESTRICTION],
        mosaicId: transactionBody.mosaicId.toHex(), // Todo format mosaic
        targetAddress: this.formatRecipientAddress(transactionBody.targetAddress),
        restrictionKey: transactionBody.restrictionKey.toHex(),
        previousRestrictionValue: transactionBody.previousRestrictionValue.compact(),
        newRestrictionValue: transactionBody.newRestrictionValue.compact()
      }

    case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_GLOBAL_RESTRICTION],
        referenceMosaicId: transactionBody.referenceMosaicId.toHex() === '0000000000000000' ? transactionBody.mosaicId.toHex() : transactionBody.referenceMosaicId.toHex(), // todo format Mosaic
        restrictionKey: transactionBody.restrictionKey.toHex(),
        previousRestrictionType: Constants.MosaicRestrictionType[transactionBody.previousRestrictionType],
        previousRestrictionValue: transactionBody.previousRestrictionValue.compact(),
        newRestrictionType: Constants.MosaicRestrictionType[transactionBody.newRestrictionType],
        newRestrictionValue: transactionBody.newRestrictionValue.compact()
      }

    case TransactionType.ACCOUNT_METADATA:
      return {
        type: Constants.TransactionType[TransactionType.ACCOUNT_METADATA],
        scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
        targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
        metadataValue: transactionBody.value,
        valueSizeDelta: transactionBody.valueSizeDelta
      }

    case TransactionType.MOSAIC_METADATA:
      return {
        type: Constants.TransactionType[TransactionType.MOSAIC_METADATA],
        scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
        targetMosaicId: transactionBody.targetMosaicId.toHex(), // Todo Format mosaic
        targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
        metadataValue: transactionBody.value,
        valueSizeDelta: transactionBody.valueSizeDelta
      }

    case TransactionType.NAMESPACE_METADATA:
      return {
        type: Constants.TransactionType[TransactionType.NAMESPACE_METADATA],
        transactionType: TransactionType.NAMESPACE_METADATA,
        scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
        targetNamespaceId: transactionBody.targetNamespaceId.toHex(),
        targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
        metadataValue: transactionBody.value,
        valueSizeDelta: transactionBody.valueSizeDelta
      }
    }
  }

  /**
   * Format transactionInfoDTO
   * @param transactionInfoDTO
   * @returns readable transactionInfoDTO object
   */
  static formatTransactionInfo = transactionInfo => {
    if (transactionInfo instanceof TransactionInfo) {
      return {
        ...transactionInfo,
        height: transactionInfo.height.compact()
      }
    }

    if (transactionInfo instanceof AggregateTransactionInfo) {
      return {
        ...transactionInfo
      }
    }

    return {}
  }
}

export default TransactionService
