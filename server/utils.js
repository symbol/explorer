const { TransactionType, Address } = require('nem2-sdk');
const moment = require('moment');

const Nodes = [
	{ protocol: 'http', domain: '52.194.207.217', port: 3000 },
	{ protocol: 'http', domain: '3.1.202.148', port: 3000 },
	{ protocol: 'http', domain: '13.114.200.132', port: 3000 },
	{ protocol: 'http', domain: '47.107.245.217', port: 3000 },
	{ protocol: 'https', domain: 'jp5.nemesis.land', port: 3001 },
	{ protocol: 'http', domain: '13.114.200.132', port: 3001 },
];

function getNodeEndPoint() {
	// Todo: Check on node status before return
	let endPoint =
		Nodes[1].protocol + '://' + Nodes[1].domain + ':' + Nodes[1].port;
	return endPoint;
}

function getTimestampNemesisBlock() {
	return 1459468800;
}

function formatBlock(block) {
	blockObj = {
		height: block.height.compact(),
		hash: block.hash,
		timestamp: block.timestamp.compact() / 1000 + getTimestampNemesisBlock(),
		date: moment(
			(block.timestamp.compact() / 1000 + getTimestampNemesisBlock()) * 1000
		).format('YYYY-MM-DD HH:mm:ss'),
		totalFee: block.totalFee.compact(),
		difficulty: (block.difficulty.compact() / 1000000000000).toFixed(2),
		numTransactions: block.numTransactions,
		signature: block.signature,
		signer: block.signer,
		previousBlockHash: block.previousBlockHash,
		blockTransactionsHash: block.blockTransactionsHash,
		blockReceiptsHash: block.blockReceiptsHash,
		stateHash: block.stateHash,
	};

	return blockObj;
}

function formatBlocks(blockList) {
	if (blockList) {
		return blockList.map(block => {
			return formatBlock(block);
		});
	}
	return;
}

function formatTransaction(tx) {
	transactionObj = {
		deadline: moment(new Date(tx.deadline.value)).format('YYYY-MM-DD HH:mm:ss'),
		fee: tx.maxFee.compact(),
		signature: tx.signature,
		signer: tx.signer,
		blocHeight: tx.transactionInfo.height.compact(),
		transactionHash: tx.transactionInfo.hash,
		transactionId: tx.transactionInfo.id,
		transactionDetail: formatTx(tx),
	};

	return transactionObj;
}

function formatTx(tx) {
	switch (tx.type) {
		case TransactionType.TRANSFER:
			transferObj = {
				type: 'Transfer',
				typeId: TransactionType.TRANSFER,
				recipient: tx.recipient,
				mosaics: formatMosaics(tx.mosaics),
				message: tx.message.payload,
			};
			return transferObj;
		case TransactionType.REGISTER_NAMESPACE:
			registerNamespaceObj = {
				type: 'RegisterNamespace',
				typeId: TransactionType.REGISTER_NAMESPACE,
				recipient: tx.recipient,
				namespaceType: tx.namespaceType,
				namespaceName: tx.namespaceName,
				namespaceId: tx.namespaceId.id.toHex(),
				parentId: tx.parentId ? '' : tx.parentId,
				duration: tx.duration,
			};
			return registerNamespaceObj;
		case TransactionType.ADDRESS_ALIAS:
			return 'Address alias';
		case TransactionType.MOSAIC_ALIAS:
			mosaicAlias = {
				type: 'MosaicAlias',
				typeId: TransactionType.MOSAIC_ALIAS,
				actionType: tx.actionType,
				namespaceId: tx.namespaceId.id.toHex(),
				mosaicId: tx.mosaicId.id.toHex(),
			};
			return mosaicAlias;
		case TransactionType.MOSAIC_DEFINITION:
			mosaicDefinitionObj = {
				type: 'MosaicDefinition',
				typeId: TransactionType.MOSAIC_DEFINITION,
				mosaicId: tx.mosaicId.toHex().toLowerCase(),
				mosaicProperties: {
					divisibility: tx.mosaicProperties.divisibility,
					duration: tx.mosaicProperties.duration,
					supplyMutable: tx.mosaicProperties.supplyMutable,
					transferable: tx.mosaicProperties.transferable,
					restrictable: tx.mosaicProperties.restrictable,
				},
			};
			return mosaicDefinitionObj;
		case TransactionType.MOSAIC_SUPPLY_CHANGE:
			mosaicSupplyChangeObj = {
				type: 'MosaicSupplyChange',
				typeId: TransactionType.MOSAIC_SUPPLY_CHANGE,
				mosaicId: tx.mosaicId.id.toHex(),
				direction: tx.direction == 1 ? 'Increase' : 'Decrease',
				delta: tx.delta.compact(),
			};
			return mosaicSupplyChangeObj;
		case TransactionType.MODIFY_MULTISIG_ACCOUNT:
			return 'Modify multisig account';
		case TransactionType.AGGREGATE_COMPLETE:
			return 'Aggregate complete';
		case TransactionType.AGGREGATE_BONDED:
			return 'Aggregate bonded';
		case TransactionType.LOCK:
			return 'Lock';
		case TransactionType.SECRET_LOCK:
			return 'Secrxwet lock';
		case TransactionType.SECRET_PROOF:
			return 'Secret proof';
		case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
			return 'Mod. account address';
		case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
			return 'Mod. account mosaic';
		case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
			return 'Mod. account entity type';
		case TransactionType.LINK_ACCOUNT:
			return 'Link account';
	}
}

function formatTxs(txList) {
	if (txList) {
		return txList.map(tx => {
			return formatTransaction(tx);
		});
	}
	return;
}

function formatMosaics(mosaics) {
	mosaics.map(mosaic => {
		mosaic.id = mosaic.id.toHex();
		mosaic.amount = mosaic.amount.compact();
	});
	return mosaics;
}

function formatNamespaces(namespaces) {
  // active: true,
  //   index: 0,
  //   metaId: '5D467491671DE6000112A130',
  //   type: 1,
  //   depth: 2,
  //   levels: [ [Object], [Object] ],
  //   owner:
  //    PublicAccount {
  //      publicKey: 'EFF9BC7472263D03EF6362B1F200FD3061BCD1BABE78F82119FB88811227CE85',
  //      address: [Object] },
  //   alias: MosaicAlias { type: 1, mosaicId: [Array] } },

	namespaces.map(namespace => {
		namespace.startHeight = namespace.startHeight.compact();
    namespace.endHeight = namespace.endHeight.compact();
    namespace.parentId = namespace.parentId.id.toHex();
	});
	return namespaces;
}

function formatAccount(accountInfo) {
	let importanceScore = accountInfo.importance.compact();

	if (importanceScore) {
		importanceScore /= 90000;
		importanceScore = importanceScore.toFixed(4).split('.');
		importanceScore = importanceScore[0] + '.' + importanceScore[1];
	}

	accountObj = {
		meta: accountInfo.meta,
		address: new Address(accountInfo.address.address).pretty(),
		addressHeight: accountInfo.addressHeight.compact(),
		publicKey: accountInfo.publicKey,
		publicKeyHeight: accountInfo.publicKeyHeight.compact(),
		mosaics: formatMosaics(accountInfo.mosaics),
		importance: importanceScore,
		importanceHeight: accountInfo.importanceHeight.compact(),
	};

	return accountObj;
}

module.exports = {
	getNodeEndPoint,
	formatBlock,
	formatBlocks,
  formatTxs,
  formatTransaction,
  formatAccount,
  formatNamespaces,
};
