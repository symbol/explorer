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

// Parse the version field from the version/network type field.
const createVersionFromDTO = version =>
  parseInt(version.toString(16).substr(2, 2), 16)

const createUInt64FromDTO = uint64DTO =>
  symbol.UInt64.fromNumericString(uint64DTO)

const createPublicAccountFromDTO = (publicKey, networkType) => {
  if (undefined === publicKey)
    return undefined

  return symbol.PublicAccount.createFromPublicKey(publicKey, networkType)
}

const createActivityBucketFromDTO = (activityBucketDTO, networkType) =>
  new symbol.ActivityBucket(
    activityBucketDTO.startHeight,
    activityBucketDTO.totalFeesPaid,
    activityBucketDTO.beneficiaryCount,
    activityBucketDTO.rawScore
  )

const createAccountInfoFromDTO = (accountInfoDTO, networkType) =>
  new symbol.AccountInfo(
    symbol.Address.createFromEncoded(accountInfoDTO.account.address),
    createUInt64FromDTO(accountInfoDTO.account.addressHeight),
    accountInfoDTO.account.publicKey,
    createUInt64FromDTO(accountInfoDTO.account.publicKeyHeight),
    accountInfoDTO.account.accountType.valueOf(),
    accountInfoDTO.account.linkedAccountKey,
    accountInfoDTO.account.activityBuckets.map(activityBucketDTO => createActivityBucketFromDTO(activityBucketDTO, networkType)),
    accountInfoDTO.account.mosaics.map(mosaicDTO => createMosaicFromDTO(mosaicDTO, networkType)),
    createUInt64FromDTO(accountInfoDTO.account.importance),
    createUInt64FromDTO(accountInfoDTO.account.importanceHeight)
  )

const createBlockInfoFromDTO = (blockDTO, networkType) =>
  new symbol.BlockInfo(
    blockDTO.meta.hash,
    blockDTO.meta.generationHash,
    createUInt64FromDTO(blockDTO.meta.totalFee),
    blockDTO.meta.numTransactions,
    blockDTO.block.signature,
    createPublicAccountFromDTO(blockDTO.block.signerPublicKey, networkType),
    networkType,
    createVersionFromDTO(blockDTO.block.version),
    blockDTO.block.type,
    createUInt64FromDTO(blockDTO.block.height),
    createUInt64FromDTO(blockDTO.block.timestamp),
    createUInt64FromDTO(blockDTO.block.difficulty),
    blockDTO.block.feeMultiplier,
    blockDTO.block.previousBlockHash,
    blockDTO.block.blockTransactionsHash,
    blockDTO.block.blockReceiptsHash,
    blockDTO.block.stateHash,
    createPublicAccountFromDTO(blockDTO.block.beneficiaryPublicKey, networkType)
  )

const createMosaicFromDTO = (mosaicDTO, networkType) =>
  new symbol.Mosaic(
    createUInt64FromDTO(mosaicDTO.amount)
  )

const createMosaicInfoFromDTO = (mosaicInfoDTO, networkType) =>
  new symbol.MosaicInfo(
    new symbol.MosaicId(mosaicInfoDTO.mosaic.id),
    createUInt64FromDTO(mosaicInfoDTO.mosaic.supply),
    createUInt64FromDTO(mosaicInfoDTO.mosaic.startHeight),
    createPublicAccountFromDTO(mosaicInfoDTO.mosaic.ownerPublicKey, networkType),
    mosaicInfoDTO.mosaic.revision,
    new symbol.MosaicFlags(mosaicInfoDTO.mosaic.flags),
    mosaicInfoDTO.mosaic.divisibility,
    createUInt64FromDTO(mosaicInfoDTO.mosaic.duration)
  )

const createNamespaceIdFromDTO = (namespaceIdDTO) =>
  symbol.NamespaceId.createFromEncoded(namespaceIdDTO)

const extractLevels = (namespaceDTO) => {
  const result = []
  if (namespaceDTO.level0)
    result.push(createNamespaceIdFromDTO(namespaceDTO.level0))

  if (namespaceDTO.level1)
    result.push(createNamespaceIdFromDTO(namespaceDTO.level1))

  if (namespaceDTO.level2)
    result.push(createNamespaceIdFromDTO(namespaceDTO.level2))

  return result
}

const extractAlias = (namespaceDTO) => {
  if (namespaceDTO.alias && namespaceDTO.alias.type === symbol.AliasType.Mosaic)
    return new symbol.Alias(symbol.AliasType.Mosaic, undefined, new symbol.MosaicId(namespaceDTO.alias.mosaicId))
  else if (namespaceDTO.alias && namespaceDTO.alias.type === symbol.AliasType.Address)
    return new symbol.Alias(symbol.AliasType.Address, symbol.Address.createFromEncoded(namespaceDTO.alias.address), undefined)

  return new symbol.Alias(symbol.AliasType.None, undefined, undefined)
}

const createNamespaceInfoFromDTO = (namespaceInfoDTO, networkType) =>
  new symbol.NamespaceInfo(
    namespaceInfoDTO.meta.active,
    namespaceInfoDTO.meta.index,
    namespaceInfoDTO.meta.id,
    namespaceInfoDTO.namespace.registrationType,
    namespaceInfoDTO.namespace.depth,
    extractLevels(namespaceInfoDTO.namespace),
    createNamespaceIdFromDTO(namespaceInfoDTO.namespace.parentId),
    createPublicAccountFromDTO(namespaceInfoDTO.namespace.ownerPublicKey, networkType),
    createUInt64FromDTO(namespaceInfoDTO.namespace.startHeight),
    createUInt64FromDTO(namespaceInfoDTO.namespace.endHeight),
    extractAlias(namespaceInfoDTO.namespace)
  )

const createTransactionFromDTO = (transactionDTO, networkType) =>
  symbol.TransactionMapping.createFromDTO(transactionDTO)

const createNodeInfoFromDTO = (nodeInfoDTO, networkType) =>
  new symbol.NodeInfo(
    nodeInfoDTO.publicKey,
    nodeInfoDTO.networkGenerationHash,
    nodeInfoDTO.port,
    nodeInfoDTO.networkIdentifier,
    nodeInfoDTO.version,
    nodeInfoDTO.roles,
    nodeInfoDTO.host,
    nodeInfoDTO.friendlyName
  )

export default {
  createAccountInfoFromDTO,
  createBlockInfoFromDTO,
  createMosaicInfoFromDTO,
  createNamespaceInfoFromDTO,
  createTransactionFromDTO,
  createNodeInfoFromDTO
}
