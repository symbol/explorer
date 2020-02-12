import { Address, TransactionType, ReceiptType, ResolutionType } from 'nem2-sdk'
import { Constants } from './config'
import moment from 'moment'
import http from './infrastructure/http'
import helper from './helper'

// FORMAT FEE

// Convert micro-xem (smallest unit) to XEM.
const microxemToXem = amount => amount / Math.pow(10, Constants.NetworkConfig.NATIVE_MOSAIC_DIVISIBILITY)

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
  if (importanceScore) {
    importanceScore /= 90000
    importanceScore = importanceScore.toFixed(4).split('.')
    importanceScore = importanceScore[0] + '.' + importanceScore[1]

    return importanceScore
  }
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
    importance: formatImportanceScore(accountInfo.importance.compact()),
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
    let transferObj = {
      type: Constants.TransactionType[TransactionType.TRANSFER],
      transactionType: TransactionType.TRANSFER,
      recipient: transactionBody.recipientAddress.address,
      mosaics: formatMosaics(transactionBody.mosaics),
      message: transactionBody.message.payload
    }
    return transferObj
  case TransactionType.NAMESPACE_REGISTRATION:
    let parentIdHex = transactionBody.parentId ? transactionBody.parentId.toHex() : ''
    let duration = transactionBody.duration ? transactionBody.duration.compact() : 0

    let registerNamespaceObj = {
      type: Constants.TransactionType[TransactionType.NAMESPACE_REGISTRATION],
      transactionType: TransactionType.NAMESPACE_REGISTRATION,
      recipient: Constants.NetworkConfig.NAMESPACE_RENTAL_FEE_SINK_ADDRESS,
      registrationType: Constants.NamespaceRegistrationType[transactionBody.registrationType],
      namespaceName: transactionBody.namespaceName,
      namespaceId: transactionBody.namespaceId.toHex(),
      parentId: parentIdHex === '' ? Constants.Message.UNAVAILABLE : parentIdHex,
      duration: duration === 0 ? Constants.Message.UNLIMITED : duration
    }
    return registerNamespaceObj
  case TransactionType.ADDRESS_ALIAS:
    let addressAliasObj = {
      type: Constants.TransactionType[TransactionType.ADDRESS_ALIAS],
      transactionType: TransactionType.ADDRESS_ALIAS,
      aliasAction: Constants.AliasAction[transactionBody.actionType],
      namespaceId: transactionBody.namespaceId.toHex()
    }
    return addressAliasObj

  case TransactionType.MOSAIC_ALIAS:
    let mosaicAlias = {
      type: Constants.TransactionType[TransactionType.MOSAIC_ALIAS],
      transactionType: TransactionType.MOSAIC_ALIAS,
      aliasAction: Constants.AliasAction[transactionBody.aliasAction],
      namespaceId: transactionBody.namespaceId.id.toHex(),
      mosaicId: transactionBody.mosaicId.id.toHex()
    }
    return mosaicAlias
  case TransactionType.MOSAIC_DEFINITION:
    let mosaicDefinitionObj = {
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
    return mosaicDefinitionObj
  case TransactionType.MOSAIC_SUPPLY_CHANGE:
    let mosaicSupplyChangeObj = {
      type: Constants.TransactionType[TransactionType.MOSAIC_SUPPLY_CHANGE],
      transactionType: TransactionType.MOSAIC_SUPPLY_CHANGE,
      mosaicId: transactionBody.mosaicId.id.toHex(),
      action: Constants.MosaicSupplyChangeAction[transactionBody.action],
      delta: transactionBody.delta.compact()
    }
    return mosaicSupplyChangeObj
  case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
    let modifyMultisigAccountObj = {
      type: Constants.TransactionType[TransactionType.MULTISIG_ACCOUNT_MODIFICATION],
      transactionType: TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
      minApprovalDelta: transactionBody.minApprovalDelta,
      minRemovalDelta: transactionBody.minRemovalDelta,
      modifications: transactionBody.modifications
    }
    return modifyMultisigAccountObj

  case TransactionType.AGGREGATE_COMPLETE:
    let aggregateCompleteObj = {
      type: Constants.TransactionType[TransactionType.AGGREGATE_COMPLETE],
      transactionType: TransactionType.AGGREGATE_COMPLETE,
      innerTransactions: formatTransactions(transactionBody.innerTransactions),
      cosignatures: formatCosignatures(transactionBody.cosignatures)
    }
    return aggregateCompleteObj
  case TransactionType.AGGREGATE_BONDED:
    let aggregateBondedObj = {
      type: Constants.TransactionType[TransactionType.AGGREGATE_BONDED],
      transactionType: TransactionType.AGGREGATE_BONDED,
      innerTransactions: formatTransactions(transactionBody.innerTransactions),
      cosignatures: formatCosignatures(transactionBody.cosignatures)
    }
    return aggregateBondedObj

  case TransactionType.HASH_LOCK:
    let lockObj = {
      type: Constants.TransactionType[TransactionType.HASH_LOCK],
      transactionType: TransactionType.HASH_LOCK,
      duration: transactionBody.duration.compact(),
      mosaicId: transactionBody.mosaic.id.toHex(),
      amount: formatFee(transactionBody.mosaic.amount)
    }
    return lockObj
  case TransactionType.SECRET_LOCK:
    let secretLockObj = {
      type: Constants.TransactionType[TransactionType.SECRET_LOCK],
      transactionType: TransactionType.SECRET_LOCK,
      duration: transactionBody.duration.compact(),
      mosaicId: transactionBody.mosaic.id.toHex(),
      secret: transactionBody.secret,
      recipient: transactionBody.recipientAddress.address,
      hashType: Constants.HashType[transactionBody.hashType]
    }
    return secretLockObj
  case TransactionType.SECRET_PROOF:
    let secretProofObj = {
      type: Constants.TransactionType[TransactionType.SECRET_PROOF],
      transactionType: TransactionType.SECRET_PROOF
    }
    return secretProofObj
  case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
    let accountRestrictionAddressObj = {
      type: Constants.TransactionType[TransactionType.ACCOUNT_ADDRESS_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_ADDRESS_RESTRICTION
    }
    return accountRestrictionAddressObj
  case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
    let accountRestrictionMosaicObj = {
      type: Constants.TransactionType[TransactionType.ACCOUNT_MOSAIC_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_MOSAIC_RESTRICTION
    }
    return accountRestrictionMosaicObj
  case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
    let accountRestrictionOperationObj = {
      type: Constants.TransactionType[TransactionType.ACCOUNT_OPERATION_RESTRICTION],
      transactionType: TransactionType.ACCOUNT_OPERATION_RESTRICTION
    }
    return accountRestrictionOperationObj
  case TransactionType.ACCOUNT_LINK:
    let linkAccountObj = {
      type: Constants.TransactionType[TransactionType.ACCOUNT_LINK],
      transactionType: TransactionType.ACCOUNT_LINK,
      linkAction: Constants.LinkAction[transactionBody.linkAction],
      remoteAccountPublicKey: transactionBody.remotePublicKey,
      remoteAccountAddress: Address.createFromPublicKey(transactionBody.remotePublicKey, http.networkType).plain()
    }
    return linkAccountObj
  case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
    let mosaicAddressRestrictionObj = {
      type: Constants.TransactionType[TransactionType.MOSAIC_ADDRESS_RESTRICTION],
      transactionType: TransactionType.MOSAIC_ADDRESS_RESTRICTION
    }
    return mosaicAddressRestrictionObj
  case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
    let mosaicGlobalRestrictionObj = {
      type: Constants.TransactionType[TransactionType.MOSAIC_GLOBAL_RESTRICTION],
      transactionType: TransactionType.MOSAIC_GLOBAL_RESTRICTION
    }
    return mosaicGlobalRestrictionObj
  case TransactionType.ACCOUNT_METADATA:
    let accountMetadataTransactionObj = {
      type: Constants.TransactionType[TransactionType.ACCOUNT_METADATA],
      transactionType: TransactionType.ACCOUNT_METADATA,
      scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
      targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
      metadataValue: transactionBody.value,
      valueSizeDelta: transactionBody.valueSizeDelta
    }
    return accountMetadataTransactionObj
  case TransactionType.MOSAIC_METADATA:
    let mosaicMetadataTransactionObj = {
      type: Constants.TransactionType[TransactionType.MOSAIC_METADATA],
      transactionType: TransactionType.MOSAIC_METADATA,
      scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
      targetMosaicId: transactionBody.targetMosaicId.toHex(),
      targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
      metadataValue: transactionBody.value,
      valueSizeDelta: transactionBody.valueSizeDelta
    }
    return mosaicMetadataTransactionObj
  case TransactionType.NAMESPACE_METADATA:
    let namespaceMetadataTransactionObj = {
      type: Constants.TransactionType[TransactionType.NAMESPACE_METADATA],
      transactionType: TransactionType.NAMESPACE_METADATA,
      scopedMetadataKey: transactionBody.scopedMetadataKey.toHex(),
      targetNamespaceId: transactionBody.targetNamespaceId.toHex(),
      targetAddress: Address.createFromPublicKey(transactionBody.targetPublicKey, http.networkType).plain(),
      metadataValue: transactionBody.value,
      valueSizeDelta: transactionBody.valueSizeDelta
    }
    return namespaceMetadataTransactionObj
  }
}

// FORMAT NAMESPACES
const formatNamespaces = namespacesInfo =>
  namespacesInfo
    .filter((ns, index, namespaces) => {
      for (let i = 0; i < index; i += 1)
        if (ns === namespaces[i]) return false

      return true
    })
    .sort((a, b) => {
      const nameA = a.namespaceInfo.metaId
      const nameB = b.namespaceInfo.metaId
      if (nameA < nameB)
        return -1

      if (nameA > nameB)
        return 1

      return 0
    })
    .map((ns, index, original) => {
      const name = ns.namespaceInfo.levels
        .map(level => original.find(n => n.namespaceInfo.id.equals(level)))
        .map(n => n.namespaceName.name)
        .join('.')
      let aliasText
      let aliasType
      switch (ns.namespaceInfo.alias.type) {
      case 1:
        aliasText = ns.namespaceInfo.alias.mosaicId.toHex()
        aliasType = Constants.Message.MOSAIC
        break
      case 2:
        aliasText = ns.namespaceInfo.alias.address
        aliasType = Constants.Message.ADDRESS
        break
      default:
        aliasText = false
        aliasType = Constants.Message.NO_ALIAS
        break
      }
      return {
        owner: ns.namespaceInfo.owner,
        namespaceName: name,
        hexId: ns.namespaceInfo.id.toHex(),
        type: Constants.NamespaceRegistrationType[ns.namespaceInfo.registrationType],
        aliastype: aliasType,
        alias: aliasText,
        aliasAction: Constants.AliasAction[ns.namespaceInfo.alias.type],
        currentAliasType: ns.namespaceInfo.alias.type,

        active: ns.namespaceInfo.active ? Constants.Message.ACTIVE : Constants.Message.INACTIVE,
        startHeight: ns.namespaceInfo.startHeight.compact(),
        endHeight: Constants.NetworkConfig.NAMESPACE.indexOf(name.toUpperCase()) !== -1
          ? Constants.Message.INFINITY
          : ns.namespaceInfo.endHeight.compact(),
        parentId: ns.namespaceInfo.parentId.id.toHex()
      }
    })

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

  const fullName = namespaceInfo.levels.map(level => {
    return namespaceNames.find((name) => name.namespaceId.equals(level))
  })
    .map((namespaceName) => namespaceName.name)
    .join('.')

  namespaceNames.map(namespace => {
    let root = namespaceNames.find(name => name.parentId === undefined)
    if (namespace.parentId) {
      let parent = namespaceNames.find(name => name.namespaceId.equals(namespace.parentId))
      namespace.name = parent.name + '.' + namespace.name

      if (root.name !== parent.name)
        namespace.name = root.name + '.' + namespace.name
    }
  })

  let { isExpired, expiredInBlock, expiredInSecond } = helper.calculateNamespaceExpiration(currentHeight, namespaceInfo.endHeight.compact())

  let namespaceObj = {
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
    // parentHexId: namespaceInfo.parentId.id.toHex().toUpperCase(),
    parentName:
      namespaceInfo.registrationType !== 0 ? fullName.split('.')[0].toUpperCase() : '',
    levels: namespaceNames,
    duration: moment.utc().add(expiredInSecond, 's').fromNow() || Constants.Message.UNLIMITED,
    isExpired: isExpired,
    approximateExpired: moment.utc().add(expiredInSecond, 's').local().format('YYYY-MM-DD HH:mm:ss'),
    expiredInBlock: expiredInBlock
  }

  return namespaceObj
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

export default {
  formatFee,
  formatBlocks,
  formatBlock,
  formatAccount,
  formatAccountMultisig,
  formatMosaics,
  formatTransactions,
  formatTransaction,
  formatTransactionBody,
  formatNamespaces,
  formatNamespace,
  formatMosaicInfo,
  formatNamespaceInfo,
  formatMetadatas,
  formatReceiptStatements,
  formatResolutionStatements,
  formatNodesInfo,
  sortMosaics
}
