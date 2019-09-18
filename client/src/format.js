import { Address, TransactionType, AliasActionType, UInt64 } from 'nem2-sdk'
import moment from 'moment'
import helper from './helper'

// FORMAT FEE

// Convert micro-xem (smallest unit) to XEM.
const microxemToXem = amount => amount / Math.pow(10, 6)

// Format fee (in microxem) to string (in XEM).
const formatFee = fee => microxemToXem(fee.compact()).toString()

// FORMAT ADDRESS

// Format address to pretty string.
const formatAddress = address => address.pretty()

// FORMAT TIMESTAMP

// Convert NEM timestamp to date.
const nemstampToDate = nemstamp =>
  new Date(Math.floor(nemstamp.compact() / 1000) + 1459468800)

// Convert date to moment.
const dateToMoment = date => moment(String(date))

// Format timestamp from nemstamp.
const formatTimestamp = nemstamp =>
  dateToMoment(nemstampToDate(nemstamp)).format('YYYY-MM-DD H:mm:ss')

// FORMAT BLOCK

const formatBlocks = (blockList) => {
  if (blockList) {
    return blockList.map(block => {
      return formatBlock(block);
    });
  }
  return;
}

const formatBlock = (block) => {
  let blockObj = {
    height: block.height.compact(),
    hash: block.hash,
    timestamp: block.timestamp.compact() / 1000 + 1459468800,
    date: moment(
      (block.timestamp.compact() / 1000 + 1459468800) * 1000
    ).format('YYYY-MM-DD HH:mm:ss'),
    totalFee: block.totalFee.compact(),
    difficulty: (block.difficulty.compact() / 1000000000000).toFixed(2),
    numTransactions: block.numTransactions ? block.numTransactions : 0,
    signature: block.signature,
    signer: block.signer,
    previousBlockHash: block.previousBlockHash,
    blockTransactionsHash: block.blockTransactionsHash,
    blockReceiptsHash: block.blockReceiptsHash,
    stateHash: block.stateHash,
  };

  return blockObj;
}

// FORMAT ACCOUNT
const formatAccount = accountInfo => {
  let importanceScore = accountInfo.importance.compact()

  if (importanceScore) {
    importanceScore /= 90000
    importanceScore = importanceScore.toFixed(4).split('.')
    importanceScore = importanceScore[0] + '.' + importanceScore[1]
  }

  const accountObj = {
    meta: accountInfo.meta,
    address: new Address(accountInfo.address.address).pretty(),
    addressHeight: accountInfo.addressHeight.compact(),
    publicKey: accountInfo.publicKey,
    publicKeyHeight: accountInfo.publicKeyHeight.compact(),
    mosaics: formatMosaics(accountInfo.mosaics),
    importance: importanceScore,
    importanceHeight: accountInfo.importanceHeight.compact(),
  }

  return accountObj
}

// FORMAT MOSAICS
const formatMosaics = mosaics => {
  mosaics.map(mosaic => {
    mosaic.hex = mosaic.id.toHex()
    mosaic.amount = mosaic.amount.compact()
  })
  return mosaics
}

// FORMAT TRANSACTIONS
const formatTransactions = transactions => {
  if (transactions) {
    return transactions.map(transaction => {
      return formatTransaction(transaction)
    })
  }
  return
}

// FORMAT TRANSACTION
const formatTransaction = transaction => {
  let transactionObj = {
    deadline: moment(new Date(transaction.deadline.value)).format(
      'YYYY-MM-DD HH:mm:ss'
    ),
    fee: transaction.maxFee.compact(),
    signature: transaction.signature,
    signer: transaction.signer,
    blockHeight: transaction.transactionInfo.height.compact(),
    transactionHash: transaction.transactionInfo.hash,
    transactionId: transaction.transactionInfo.id,
    transactionDetail: formatTransactionBody(transaction),
  }

  return transactionObj
}

// FORMAT TRANSACTION BODY
const formatTransactionBody = transactionBody => {
  switch (transactionBody.type) {
    case TransactionType.TRANSFER:
      let transferObj = {
        type: 'Transfer',
        typeId: TransactionType.TRANSFER,
        recipient: transactionBody.recipient,
        mosaics: formatMosaics(transactionBody.mosaics),
        message: transactionBody.message.payload,
      }
      return transferObj
    case TransactionType.REGISTER_NAMESPACE:
      let registerNamespaceObj = {
        type: 'RegisterNamespace',
        typeId: TransactionType.REGISTER_NAMESPACE,
        recipient: transactionBody.recipient,
        namespaceType: transactionBody.namespaceType,
        namespaceName: transactionBody.namespaceName,
        namespaceId: transactionBody.namespaceId.id.toHex(),
        parentId: transactionBody.parentId ? '' : transactionBody.parentId,
        duration: transactionBody.duration,
      }
      return registerNamespaceObj
    case TransactionType.ADDRESS_ALIAS:
      return 'Address alias'
    case TransactionType.MOSAIC_ALIAS:
      let mosaicAlias = {
        type: 'MosaicAlias',
        typeId: TransactionType.MOSAIC_ALIAS,
        actionType: transactionBody.actionType,
        namespaceId: transactionBody.namespaceId.id.toHex(),
        mosaicId: transactionBody.mosaicId.id.toHex(),
      }
      return mosaicAlias
    case TransactionType.MOSAIC_DEFINITION:
      let mosaicDefinitionObj = {
        type: 'MosaicDefinition',
        typeId: TransactionType.MOSAIC_DEFINITION,
        mosaicId: transactionBody.mosaicId.toHex().toLowerCase(),
        mosaicProperties: {
          divisibility: transactionBody.mosaicProperties.divisibility,
          duration: transactionBody.mosaicProperties.duration,
          supplyMutable: transactionBody.mosaicProperties.supplyMutable,
          transferable: transactionBody.mosaicProperties.transferable,
          restrictable: transactionBody.mosaicProperties.restrictable,
        },
      }
      return mosaicDefinitionObj
    case TransactionType.MOSAIC_SUPPLY_CHANGE:
      let mosaicSupplyChangeObj = {
        type: 'MosaicSupplyChange',
        typeId: TransactionType.MOSAIC_SUPPLY_CHANGE,
        mosaicId: transactionBody.mosaicId.id.toHex(),
        direction: transactionBody.direction == 1 ? 'Increase' : 'Decrease',
        delta: transactionBody.delta.compact(),
      }
      return mosaicSupplyChangeObj
    case TransactionType.MODIFY_MULTISIG_ACCOUNT:
      return 'Modify multisig account'
    case TransactionType.AGGREGATE_COMPLETE:
      return 'Aggregate complete'
    case TransactionType.AGGREGATE_BONDED:
      return 'Aggregate bonded'
    case TransactionType.LOCK:
      return 'Lock'
    case TransactionType.SECRET_LOCK:
      return 'Secrxwet lock'
    case TransactionType.SECRET_PROOF:
      return 'Secret proof'
    case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
      return 'Mod. account address'
    case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
      return 'Mod. account mosaic'
    case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
      return 'Mod. account entity type'
    case TransactionType.LINK_ACCOUNT:
      return 'Link account'
  }
}

// FORMAT NAMESPACES
const formatNamespaces = namespacesInfo =>
  namespacesInfo
    .filter((ns, index, namespaces) => {
      for (let i = 0; i < index; i += 1) {
        if (ns === namespaces[i]) return false
      }
      return true
    })
    .sort((a, b) => {
      const nameA = a.namespaceInfo.metaId
      const nameB = b.namespaceInfo.metaId
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
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
          aliasText = new UInt64(ns.namespaceInfo.alias.mosaicId).toHex()
          aliasType = 'Mosaic'
          break
        case 2:
          aliasText = Address.createFromEncoded(
            ns.namespaceInfo.alias.address
          ).pretty()
          aliasType = 'Address'
          break
        default:
          aliasText = false
          aliasType = 'no alias'
          break
      }
      return {
        owner: ns.namespaceInfo.owner,
        namespaceName: name,
        hexId: ns.namespaceInfo.id.toHex(),
        type:
          ns.namespaceInfo.type === 0 ? 'Root' : 'Child',
        aliastype: aliasType,
        alias: aliasText,
        aliasAction:
          ns.namespaceInfo.alias.type === 0
            ? AliasActionType.Link
            : AliasActionType.Unlink,
        currentAliasType: ns.namespaceInfo.alias.type,

        active: ns.namespaceInfo.active,
        startHeight: ns.namespaceInfo.startHeight.compact(),
        endHeight: name.includes('nem')
          ? 'Infinity'
          : ns.namespaceInfo.endHeight.compact(),
        parentId: ns.namespaceInfo.parentId.id.toHex(),
      }
    })

// FORMAT NAMESPACE
const formatNamespace = (namespaceInfo, namespaceNames) => {
  let aliasText
  let aliasType
  switch (namespaceInfo.alias.type) {
    case 1:
      aliasText = new UInt64(namespaceInfo.alias.mosaicId).toHex()
      aliasType = 'Mosaic'
      break
    case 2:
      aliasText = Address.createFromEncoded(
        namespaceInfo.alias.address
      ).pretty()
      aliasType = 'Address'
      break
    default:
      aliasText = false
      aliasType = 'no alias'
      break
  }

  let namespaceObj = {
    owner: namespaceInfo.owner,
    namespaceName: namespaceInfo.name,
    hexId: namespaceInfo.id.toHex().toUpperCase(),
    type: namespaceInfo.type === 0 ? 'ROOT' : 'SUB',
    startHeight: namespaceInfo.startHeight.compact(),
    endHeight: namespaceInfo.name.includes('nem')
      ? 'Infinity'
      : namespaceInfo.endHeight.compact(),
    active: namespaceInfo.active.toString().toUpperCase(),
    aliastype: aliasType,
    alias: aliasText,
    parentHexId: namespaceInfo.parentId.id.toHex().toUpperCase(),
    parentName:
      namespaceInfo.type !== 0 ? namespaceInfo.name.split('.')[0].toUpperCase() : '',
    levels: namespaceNames
  }

  return namespaceObj
}

export default {
  formatAddress,
  formatFee,
  formatTimestamp,
  formatBlocks,
  formatBlock,
  formatAccount,
  formatMosaics,
  formatTransactions,
  formatTransaction,
  formatTransactionBody,
  formatNamespaces,
  formatNamespace,
}
