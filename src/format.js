import { Address, TransactionType, ReceiptType, ResolutionType, AccountRestrictionFlags } from 'symbol-sdk'
import { Constants } from './config'
import moment from 'moment'
import http from './infrastructure/http'
import helper from './helper'

// FORMAT FEE

// Convert micro-xem (smallest unit) to XEM.
const microxemToXem = amount => amount / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)

const formatBlocktransactions = transactions =>
  transactions?.map((el) => ({
    deadline: el.deadline,
    transactionId: el.transactionId,
    transactionHash: el.transactionHash,
    type: el.transactionBody?.type
  })) || []

// Convert Mosaic amount to relative Amount with divisibility.
const formatMosaicAmountWithDivisibility = (amount, divisibility) => {
  let relativeAmount = divisibility !== 0 ? amount / Math.pow(10, divisibility) : amount.compact()
  return relativeAmount.toLocaleString('en-US', { minimumFractionDigits: divisibility })
}

// Format fee (in microxem) to string (in XEM).
const formatFee = fee => microxemToXem(fee.compact()).toLocaleString('en-US', { minimumFractionDigits: Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY })

// Format ImportantScore
const formatImportanceScore = importanceScore => {
  // Calculate the importance score.
  const totalchainimportance = Constants.NetworkConfig.TOTAL_CHAIN_IMPORTANCE

  if (importanceScore)
    return (importanceScore / totalchainimportance)

  return importanceScore
}

// FORMAT BLOCK

const formatBlocks = (blockList) => {
  return blockList.map(block => {
    return formatBlock(block)
  })
}

const formatBlock = block => ({
  height: block.height.compact(),
  hash: block.hash,
  timestamp: Math.round(block.timestamp / 1000) + Constants.NetworkConfig.NEMESIS_TIMESTAMP,
  date: moment.utc(
    (Math.round(block.timestamp / 1000) + Constants.NetworkConfig.NEMESIS_TIMESTAMP) * 1000
  ).local().format('YYYY-MM-DD HH:mm:ss'),
  totalFee: formatFee(block.totalFee),
  difficulty: ((block.difficulty.compact() / 1000000000000).toFixed(2)).toString(),
  feeMultiplier: microxemToXem(block.feeMultiplier).toLocaleString('en-US', { minimumFractionDigits: Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY }),
  numTransactions: block.numTransactions,
  signature: block.signature,
  signer: Address.createFromPublicKey(block.signer.publicKey, http.networkType).plain(),
  previousBlockHash: block.previousBlockHash,
  blockTransactionsHash: block.blockTransactionsHash,
  blockReceiptsHash: block.blockReceiptsHash,
  stateHash: block.stateHash
})

// FORMAT ACCOUNT
const formatAccount = accountInfo => {
  // Process the account activity.
  let lastActivity
  let harvestedBlocks
  let harvestedFees
  if (accountInfo.activityBucket.length > 0) {
    const bucketList = accountInfo.activityBucket
    const length = bucketList.length
    const bucket = bucketList[length - 1]
    lastActivity = parseInt(bucket.startHeight, 10)
    harvestedBlocks = length
    harvestedFees = bucketList.reduce((x, y) => x + parseInt(y.totalFeesPaid, 10), 0)
  } else {
    lastActivity = 1
    harvestedBlocks = 0
    harvestedFees = 0
  }

  const accountObj = {
    meta: accountInfo.meta,
    address: accountInfo.address,
    addressHeight: accountInfo.addressHeight.compact(),
    publicKey: accountInfo.publicKey,
    publicKeyHeight: accountInfo.publicKeyHeight.compact(),
    mosaics: formatMosaics(accountInfo.mosaics),
    importance: (formatImportanceScore(accountInfo.importance.compact()) * 100).toFixed(6).toString() + ' %',
    importanceHeight: accountInfo.importanceHeight.compact(),
    accountType: Constants.AccountType[accountInfo.accountType],
    activityBucket: accountInfo.activityBucket,
    linkedAccountKey: Constants.AccountType[accountInfo.accountType] === 'Unlinked' ? Constants.Message.UNAVAILABLE : Address.createFromPublicKey(accountInfo.linkedAccountKey, http.networkType).plain(),
    lastActivity: lastActivity,
    harvestedBlocks: harvestedBlocks,
    harvestedFees: harvestedFees
  }

  if (accountInfo.accountName.names.length > 0) {
    accountObj.accountAliasName = accountInfo.accountName.names[0].name
    accountObj.accountAliasNameHex = accountInfo.accountName.names[0].namespaceId.toHex()
  }

  return accountObj
}

// FORMAT MultiSig Account

const formatAccountMultisig = accountMultisig => {
  const accountMultisigObj = {
    ...accountMultisig,
    cosignatories: accountMultisig.cosignatories.map(cosigner => ({
      address: cosigner.address.plain(),
      publicKey: cosigner.publicKey
    }))
  }
  return accountMultisigObj
}

// FORMAT MOSAICS
const formatMosaics = mosaics => {
  return mosaics.map(mosaic => {
    if (mosaic.hasOwnProperty('mosaicInfoAliasName')) {
      return {
        id: mosaic.id.toHex(),
        amount: formatMosaicAmountWithDivisibility(mosaic.amount, mosaic.mosaicInfoAliasName.mosaicInfo.divisibility),
        mosaicAliasName: mosaic.mosaicInfoAliasName.mosaicName.names.length > 0 ? mosaic.mosaicInfoAliasName.mosaicName.names[0].name : Constants.Message.UNAVAILABLE
      }
    } else {
      return {
        ...mosaic,
        id: mosaic.id.toHex(),
        amount: mosaic.amount.compact().toString()
      }
    }
  })
}

const sortMosaics = mosaics => {
  let sortedMosaics = []

  mosaics.forEach(mosaic =>
    mosaic.mosaicId === Constants.NetworkConfig.NATIVE_MOSAIC_HEX
      ? sortedMosaics.unshift(mosaic)
      : sortedMosaics.push(mosaic)
  )

  return sortedMosaics
}

// FORMAT MOSAICS INFO
const formatMosaicInfo = mosaicInfoAliasNames => ({
  mosaicId: mosaicInfoAliasNames.mosaicInfo.id.toHex(),
  mosaicAliasName: mosaicInfoAliasNames.mosaicName.names.length > 0 ? mosaicInfoAliasNames.mosaicName.names[0].name : Constants.Message.UNAVAILABLE,
  divisibility: mosaicInfoAliasNames.mosaicInfo.divisibility,
  address: mosaicInfoAliasNames.mosaicInfo.owner.address.plain(),
  supply: mosaicInfoAliasNames.mosaicInfo.supply.compact().toLocaleString('en-US'),
  relativeAmount: formatMosaicAmountWithDivisibility(mosaicInfoAliasNames.mosaicInfo.supply, mosaicInfoAliasNames.mosaicInfo.divisibility),
  revision: mosaicInfoAliasNames.mosaicInfo.revision,
  startHeight: mosaicInfoAliasNames.mosaicInfo.height.compact(),
  duration: mosaicInfoAliasNames.mosaicInfo.duration.compact(),
  supplyMutable: mosaicInfoAliasNames.mosaicInfo.flags.supplyMutable,
  transferable: mosaicInfoAliasNames.mosaicInfo.flags.transferable,
  restrictable: mosaicInfoAliasNames.mosaicInfo.flags.restrictable
})

// FORMAT TRANSACTIONS
const formatTransactions = transactions => {
  return transactions.map(transaction => {
    return formatTransaction(transaction)
  })
}

// FORMAT TRANSACTION
const formatTransaction = transaction => {
  // let effectiveFee;
  // try { effectiveFee = await http.transaction.getTransactionEffectiveFee(transaction.transactionInfo.hash).toPromise() }
  // catch(e){console.error(e)}

  // if(effectiveFee)
  //   effectiveFee = effectiveFee//formatFee(effectiveFee)
  // else
  //   effectiveFee = "N/A"
  let transactionObj = {
    deadline: moment.utc(new Date(transaction.deadline.value)).local().format(
      'YYYY-MM-DD HH:mm:ss'
    ),
    fee: formatFee(transaction.maxFee),
    signature: transaction.signature,
    signer: transaction.signer.address.plain(),
    blockHeight: transaction.transactionInfo.height.compact(),
    transactionHash: transaction.transactionInfo.hash,
    transactionId: transaction.transactionInfo.id,
    transactionBody: formatTransactionBody(transaction)
  }

  return transactionObj
}

// FORMAT AggregateCosignatures
const formatCosignatures = cosignatures => {
  cosignatures.map(cosigner => {
    cosigner.signer = cosigner.signer.address.address
  })

  return cosignatures
}

// FORMAT TRANSACTION BODY
const formatTransactionBody = transactionBody => {
  switch (transactionBody.type) {
  case TransactionType.TRANSFER:
    return {
      type: Constants.TransactionType[TransactionType.TRANSFER],
      transactionType: TransactionType.TRANSFER,
      recipient: transactionBody.recipientAddress.address,
      mosaics: formatMosaics(transactionBody.mosaics),
      message: transactionBody.message.payload
    }

  case TransactionType.NAMESPACE_REGISTRATION:
    let parentIdHex = transactionBody.parentId ? transactionBody.parentId.toHex() : ''
    let duration = transactionBody.duration ? transactionBody.duration.compact() : 0

    return {
      type: Constants.TransactionType[TransactionType.NAMESPACE_REGISTRATION],
      transactionType: TransactionType.NAMESPACE_REGISTRATION,
      recipient: Constants.NetworkConfig.NAMESPACE_RENTAL_FEE_SINK_ADDRESS,
      registrationType: Constants.NamespaceRegistrationType[transactionBody.registrationType],
      namespaceName: transactionBody.namespaceName,
      namespaceId: transactionBody.namespaceId.toHex(),
      parentId: parentIdHex === '' ? Constants.Message.UNAVAILABLE : parentIdHex,
      duration: duration === 0 ? Constants.Message.UNLIMITED : duration
    }

  case TransactionType.ADDRESS_ALIAS:
    return {
      type: Constants.TransactionType[TransactionType.ADDRESS_ALIAS],
      transactionType: TransactionType.ADDRESS_ALIAS,
      aliasAction: Constants.AliasAction[transactionBody.aliasAction],
      namespaceId: transactionBody.namespaceId.toHex()
    }

  case TransactionType.MOSAIC_ALIAS:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_ALIAS],
      transactionType: TransactionType.MOSAIC_ALIAS,
      aliasAction: Constants.AliasAction[transactionBody.aliasAction],
      namespaceId: transactionBody.namespaceId.id.toHex(),
      mosaicId: transactionBody.mosaicId.id.toHex()
    }

  case TransactionType.MOSAIC_DEFINITION:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_DEFINITION],
      transactionType: TransactionType.MOSAIC_DEFINITION,
      recipient: Constants.NetworkConfig.MOSAIC_RENTAL_FEE_SINK_ADDRESS,
      mosaicId: transactionBody.mosaicId.toHex(),
      divisibility: transactionBody.divisibility,
      duration: transactionBody.duration,
      nonce: transactionBody.nonce,
      supplyMutable: transactionBody.flags.supplyMutable,
      transferable: transactionBody.flags.transferable,
      restrictable: transactionBody.flags.restrictable
    }

  case TransactionType.MOSAIC_SUPPLY_CHANGE:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_SUPPLY_CHANGE],
      transactionType: TransactionType.MOSAIC_SUPPLY_CHANGE,
      mosaicId: transactionBody.mosaicId.id.toHex(),
      action: Constants.MosaicSupplyChangeAction[transactionBody.action],
      delta: transactionBody.delta.compact()
    }

  case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
    return {
      type: Constants.TransactionType[TransactionType.MULTISIG_ACCOUNT_MODIFICATION],
      transactionType: TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
      minApprovalDelta: transactionBody.minApprovalDelta,
      minRemovalDelta: transactionBody.minRemovalDelta,
      modifications: transactionBody.modifications
    }

  case TransactionType.AGGREGATE_COMPLETE:
    return {
      type: Constants.TransactionType[TransactionType.AGGREGATE_COMPLETE],
      transactionType: TransactionType.AGGREGATE_COMPLETE,
      innerTransactions: formatTransactions(transactionBody.innerTransactions),
      cosignatures: formatCosignatures(transactionBody.cosignatures)
    }

  case TransactionType.AGGREGATE_BONDED:
    return {
      type: Constants.TransactionType[TransactionType.AGGREGATE_BONDED],
      transactionType: TransactionType.AGGREGATE_BONDED,
      innerTransactions: formatTransactions(transactionBody.innerTransactions),
      cosignatures: formatCosignatures(transactionBody.cosignatures)
    }

  case TransactionType.HASH_LOCK:
    return {
      type: Constants.TransactionType[TransactionType.HASH_LOCK],
      transactionType: TransactionType.HASH_LOCK,
      duration: transactionBody.duration.compact(),
      mosaicId: transactionBody.mosaic.id.toHex(),
      amount: formatFee(transactionBody.mosaic.amount)
    }

  case TransactionType.SECRET_LOCK:
    return {
      type: Constants.TransactionType[TransactionType.SECRET_LOCK],
      transactionType: TransactionType.SECRET_LOCK,
      duration: transactionBody.duration.compact(),
      mosaicId: transactionBody.mosaic.id.toHex(),
      secret: transactionBody.secret,
      recipient: transactionBody.recipientAddress.address,
      hashType: Constants.HashType[transactionBody.hashType]
    }

  case TransactionType.SECRET_PROOF:
    return {
      type: Constants.TransactionType[TransactionType.SECRET_PROOF],
      transactionType: TransactionType.SECRET_PROOF,
      hashType: Constants.HashType[transactionBody.hashType],
      recipient: transactionBody.recipientAddress.plain(),
      secret: transactionBody.secret,
      proof: transactionBody.proof
    }

  case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
    return {
      type: Constants.TransactionType[TransactionType.ACCOUNT_ADDRESS_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_ADDRESS_RESTRICTION,
      restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
      restrictionAddressAdditions: transactionBody.restrictionAdditions.map(account => account.address),
      restrictionAddressDeletions: transactionBody.restrictionDeletions.map(account => account.address)
    }

  case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
    return {
      type: Constants.TransactionType[TransactionType.ACCOUNT_MOSAIC_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
      restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
      restrictionMosaicAdditions: transactionBody.restrictionAdditions.map(mosaic => mosaic.id.toHex()),
      restrictionMosaicDeletions: transactionBody.restrictionDeletions.map(mosaic => mosaic.id.toHex())
    }

  case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
    return {
      type: Constants.TransactionType[TransactionType.ACCOUNT_OPERATION_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_OPERATION_RESTRICTION,
      restrictionType: Constants.AccountRestrictionFlags[transactionBody.restrictionFlags],
      restrictionOperationAdditions: transactionBody.restrictionAdditions.map(operation => Constants.TransactionType[operation]),
      restrictionOperationDeletions: transactionBody.restrictionDeletions.map(operation => Constants.TransactionType[operation])
    }

  case TransactionType.ACCOUNT_LINK:
    return {
      type: Constants.TransactionType[TransactionType.ACCOUNT_LINK],
      transactionType: TransactionType.ACCOUNT_LINK,
      linkAction: Constants.LinkAction[transactionBody.linkAction],
      remoteAccountPublicKey: transactionBody.remotePublicKey,
      remoteAccountAddress: Address.createFromPublicKey(transactionBody.remotePublicKey, http.networkType).plain()
    }

  case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_ADDRESS_RESTRICTION],
      transactionType: TransactionType.MOSAIC_ADDRESS_RESTRICTION,
      mosaicId: transactionBody.mosaicId.toHex(),
      targetAddress: transactionBody.targetAddress.plain(),
      restrictionKey: transactionBody.restrictionKey.toHex(),
      previousRestrictionValue: transactionBody.previousRestrictionValue.compact(),
      newRestrictionValue: transactionBody.newRestrictionValue.compact()
    }

  case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_GLOBAL_RESTRICTION],
      transactionType: TransactionType.MOSAIC_GLOBAL_RESTRICTION,
      referenceMosaicId: transactionBody.referenceMosaicId.toHex() === '0000000000000000' ? transactionBody.mosaicId.toHex() : transactionBody.referenceMosaicId.toHex(),
      restrictionKey: transactionBody.restrictionKey.toHex(),
      previousRestrictionType: Constants.MosaicRestrictionType[transactionBody.previousRestrictionType],
      previousRestrictionValue: transactionBody.previousRestrictionValue.compact(),
      newRestrictionType: Constants.MosaicRestrictionType[transactionBody.newRestrictionType],
      newRestrictionValue: transactionBody.newRestrictionValue.compact()
    }

  case TransactionType.ACCOUNT_METADATA:
    return {
      type: Constants.TransactionType[TransactionType.ACCOUNT_METADATA],
      transactionType: TransactionType.ACCOUNT_METADATA,
      scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
      targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
      metadataValue: transactionBody.value,
      valueSizeDelta: transactionBody.valueSizeDelta
    }

  case TransactionType.MOSAIC_METADATA:
    return {
      type: Constants.TransactionType[TransactionType.MOSAIC_METADATA],
      transactionType: TransactionType.MOSAIC_METADATA,
      scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
      targetMosaicId: transactionBody.targetMosaicId.toHex(),
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

// FORMAT NAMESPACE
const formatNamespace = (namespaceInfo, namespaceNames, currentHeight = 0) => {
  let aliasText
  let aliasType
  switch (namespaceInfo.alias.type) {
  case 1:
    aliasText = namespaceInfo.alias.mosaicId.toHex()
    aliasType = Constants.Message.MOSAIC
    break
  case 2:
    aliasText = namespaceInfo.alias.address.plain()
    aliasType = Constants.Message.ADDRESS
    break
  default:
    aliasText = false
    aliasType = Constants.Message.NO_ALIAS
    break
  }

  const fullName = extractFullNamespace(namespaceInfo, namespaceNames)

  let { isExpired, expiredInBlock, expiredInSecond } = helper.calculateNamespaceExpiration(currentHeight, namespaceInfo.endHeight.compact())

  return {
    owner: namespaceInfo.owner.address.plain(),
    namespaceName: fullName,
    namespaceNameHexId: namespaceInfo.id.toHex().toUpperCase(),
    registrationType: Constants.NamespaceRegistrationType[namespaceInfo.registrationType],
    startHeight: namespaceInfo.startHeight.compact(),
    endHeight: Constants.NetworkConfig.NAMESPACE.indexOf(fullName.toUpperCase()) !== -1
      ? Constants.Message.INFINITY
      : namespaceInfo.endHeight.compact(),
    active: namespaceInfo.active ? Constants.Message.ACTIVE : Constants.Message.INACTIVE,
    aliasType: aliasType,
    alias: aliasText || aliasType,
    aliasAction: Constants.AliasAction[namespaceInfo.alias.type],
    // parentHexId: namespaceInfo.parentId.id.toHex().toUpperCase(),
    parentName:
      namespaceInfo.registrationType !== 0 ? fullName.split('.')[0].toUpperCase() : '',
    levels: namespaceNames,
    duration: moment.utc().add(expiredInSecond, 's').fromNow() || Constants.Message.UNLIMITED,
    isExpired: isExpired,
    approximateExpired: moment.utc().add(expiredInSecond, 's').local().format('YYYY-MM-DD HH:mm:ss'),
    expiredInBlock: expiredInBlock
  }
}

const extractFullNamespace = (namespaceInfo, namespaceNames) => {
  return namespaceInfo.levels.map((level) => {
    const namespaceName = namespaceNames.find((name) => name.namespaceId.equals(level))

    if (namespaceName === undefined) throw new Error('Not found')
    return namespaceName
  })
    .map((namespaceName) => namespaceName.name)
    .join('.')
}

const formatNamespaceInfo = (namespaceInfo, currentHeight = 0) => {
  let { isExpired, expiredInSecond, expiredInBlock } = helper.calculateNamespaceExpiration(currentHeight, namespaceInfo.endHeight.compact())

  return {
    active: namespaceInfo.active ? Constants.Message.ACTIVE : Constants.Message.INACTIVE,
    namespaceId: namespaceInfo.id.toHex(),
    namespaceName: namespaceInfo.namespaceName,
    index: namespaceInfo.index,
    registrationType: Constants.NamespaceRegistrationType[namespaceInfo.registrationType],
    depth: namespaceInfo.depth,
    levels: namespaceInfo.levels,
    parentId: namespaceInfo.parentId.toHex() === '0000000000000000' ? Constants.Message.UNAVAILABLE : namespaceInfo.parentId.toHex(),
    address: namespaceInfo.owner.address.plain(),
    startHeight: namespaceInfo.startHeight.compact(),
    endHeight: namespaceInfo.endHeight.compact(),
    duration: moment.utc().add(expiredInSecond, 's').fromNow() || Constants.Message.UNLIMITED,
    isExpired: isExpired,
    approximateExpired: moment.utc().add(expiredInSecond, 's').local().format('YYYY-MM-DD HH:mm:ss'),
    expiredInBlock: expiredInBlock
  }
}

const formatMetadatas = metadatas => {
  return metadatas.map(data => ({
    metadataId: data.id,
    compositeHash: data.metadataEntry.compositeHash,
    // metadataType: Constants.MetadataType[data.metadataEntry.metadataType],
    scopedMetadataKey: data.metadataEntry.scopedMetadataKey.toHex(),
    // targetId: data.metadataEntry.targetId ? data.metadataEntry.targetId.toHex() : Constants.Message.UNAVAILABLE,
    senderAddress: Address.createFromPublicKey(data.metadataEntry.senderPublicKey, http.networkType).plain(),
    targetAddress: Address.createFromPublicKey(data.metadataEntry.targetPublicKey, http.networkType).plain(),
    metadataValue: data.metadataEntry.value
  }))
}

const formatReceiptStatements = receipts => {
  let balanceChangeReceipt = []
  let balanceTransferReceipt = []
  let inflationReceipt = []
  let artifactExpiryReceipt = []

  receipts.forEach(receipt => {
    switch (receipt.type) {
    case ReceiptType.Harvest_Fee:
    case ReceiptType.LockHash_Created:
    case ReceiptType.LockHash_Completed:
    case ReceiptType.LockHash_Expired:
    case ReceiptType.LockSecret_Created:
    case ReceiptType.LockSecret_Completed:
    case ReceiptType.LockSecret_Expired:
      balanceChangeReceipt.push({
        ...receipt,
        size: receipt.size || Constants.Message.UNAVAILABLE,
        type: Constants.ReceiptType[receipt.type],
        targetPublicAccount: receipt.targetPublicAccount.address.plain(),
        amount: formatMosaicAmountWithDivisibility(receipt.amount, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
        mosaicId: receipt.mosaicId.toHex()
      })
      break
    case ReceiptType.Mosaic_Levy:
    case ReceiptType.Mosaic_Rental_Fee:
    case ReceiptType.Namespace_Rental_Fee:
      balanceTransferReceipt.push({
        ...receipt,
        size: receipt.size || Constants.Message.UNAVAILABLE,
        type: Constants.ReceiptType[receipt.type],
        sender: receipt.sender.address.plain(),
        recipientAddress: receipt.recipientAddress.address,
        amount: formatMosaicAmountWithDivisibility(receipt.amount, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
        mosaicId: receipt.mosaicId.toHex()
      })
      break
    case ReceiptType.Mosaic_Expired:
    case ReceiptType.Namespace_Expired:
    case ReceiptType.Namespace_Deleted:
      artifactExpiryReceipt.push({
        ...receipt,
        size: receipt.size || Constants.Message.UNAVAILABLE,
        type: Constants.ReceiptType[receipt.type],
        artifactId: receipt.artifactId.toHex()
      })
      break
    case ReceiptType.Inflation:
      inflationReceipt.push({
        ...receipt,
        size: receipt.size || Constants.Message.UNAVAILABLE,
        type: Constants.ReceiptType[receipt.type],
        amount: formatMosaicAmountWithDivisibility(receipt.amount, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY),
        mosaicId: receipt.mosaicId.toHex()
      })
      break
    }
  })

  return {
    balanceChangeReceipt,
    balanceTransferReceipt,
    inflationReceipt,
    artifactExpiryReceipt
  }
}

const formatResolutionStatements = resolutionStatements => {
  return resolutionStatements.map(statement => {
    if (statement.resolutionType === ResolutionType.Address) {
      return {
        type: Constants.ResolutionType[statement.resolutionType],
        unresolved: statement.unresolved.toHex(),
        addressResolutionEntries: statement.resolutionEntries[0].resolved.toHex()
      }
    } else if (statement.resolutionType === ResolutionType.Mosaic) {
      return {
        type: Constants.ResolutionType[statement.resolutionType],
        unresolved: statement.unresolved.toHex(),
        mosaicResolutionEntries: statement.resolutionEntries[0].resolved.toHex()
      }
    }
  })
}

const formatNodesInfo = nodes => {
  return nodes.map(node => ({
    ...node,
    address: Address.createFromPublicKey(node.publicKey, node.networkIdentifier).plain(),
    roles: Constants.RoleType[node.roles],
    network: Constants.NetworkType[node.networkIdentifier]
  }))
}

const formatAccountRestrictions = accountRestrictions => {
  return accountRestrictions.map(accountRestriction => {
    switch (accountRestriction.restrictionFlags) {
    case AccountRestrictionFlags.AllowIncomingAddress:
    case AccountRestrictionFlags.BlockIncomingAddress:
    case AccountRestrictionFlags.AllowOutgoingAddress:
    case AccountRestrictionFlags.BlockOutgoingAddress:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionAddressValues: accountRestriction.values.map(value => value.address)
      }
    case AccountRestrictionFlags.AllowMosaic:
    case AccountRestrictionFlags.BlockMosaic:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionMosaicValues: accountRestriction.values.map(value => value.id.toHex())
      }
    case AccountRestrictionFlags.AllowIncomingTransactionType:
    case AccountRestrictionFlags.AllowOutgoingTransactionType:
    case AccountRestrictionFlags.BlockIncomingTransactionType:
    case AccountRestrictionFlags.BlockOutgoingTransactionType:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionTransactionValues: accountRestriction.values.map(value => Constants.TransactionType[value])
      }
    }
  })
}

const formatMosaicRestriction = mosaicRestriction => {
  let mosaicGlobalRestrictionItem = []

  // Convert Map<k,v> to Array
  mosaicRestriction.restrictions.forEach((value, key) => {
    mosaicGlobalRestrictionItem.push({ key, ...value })
    return mosaicGlobalRestrictionItem
  })

  return {
    ...mosaicRestriction,
    entryType: Constants.MosaicRestrictionEntryType[mosaicRestriction.entryType],
    mosaicId: mosaicRestriction.mosaicId.toHex(),
    restrictions: mosaicGlobalRestrictionItem.map(item => ({
      restrictionKey: item.key,
      restrictionType: Constants.MosaicRestrictionType[item.restrictionType],
      restrictionValue: item.restrictionValue,
      referenceMosaicId: item.referenceMosaicId.toHex() === '0000000000000000' ? mosaicRestriction.mosaicId.toHex() : item.referenceMosaicId.toHex()
    }))
  }
}

export default {
  formatFee,
  formatBlocks,
  formatBlock,
  formatBlocktransactions,
  formatAccount,
  formatAccountMultisig,
  formatMosaics,
  formatTransactions,
  formatTransaction,
  formatTransactionBody,
  formatNamespace,
  formatMosaicInfo,
  formatNamespaceInfo,
  formatMetadatas,
  formatReceiptStatements,
  formatResolutionStatements,
  formatNodesInfo,
  sortMosaics,
  formatAccountRestrictions,
  formatMosaicRestriction
}
