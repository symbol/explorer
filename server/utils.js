const {
	TransactionType,
	Address,
	UInt64,
	AliasActionType,
} = require('nem2-sdk');
const moment = require('moment');

const Nodes = [
	{ protocol: 'http', domain: '52.194.207.217', port: 3000 },
	{ protocol: 'http', domain: '3.1.202.148', port: 3000 },
	{ protocol: 'http', domain: '13.114.200.132', port: 3000 },
	{ protocol: 'http', domain: '47.107.245.217', port: 3000 },
];

function getNodeEndPoint() {
	// Todo: Check on node status before return

	const pointer = 1;
	let endPoint =
		Nodes[pointer].protocol +
		'://' +
		Nodes[pointer].domain +
		':' +
		Nodes[pointer].port;
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

function formatNamespace(namespaceInfo) {
	let aliasText;
	let aliasType;
	switch (namespaceInfo.alias.type) {
		case 1:
			aliasText = new UInt64(namespaceInfo.alias.mosaicId).toHex();
			aliasType = 'mosaic alias:';
			break;
		case 2:
			aliasText = Address.createFromEncoded(
				namespaceInfo.alias.address
			).pretty();
			aliasType = 'address alias:';
			break;
		default:
			aliasText = false;
			aliasType = 'no alias';
			break;
	}

	namespaceObj = {
		owner: namespaceInfo.owner,
		namespaceName: namespaceInfo.name,
		hexId: namespaceInfo.id.toHex(),
		type: namespaceInfo.type === 0 ? 'Root namespace' : 'Child namespace',
		startHeight: namespaceInfo.startHeight.compact(),
		endHeight: namespaceInfo.endHeight.compact(),
		active: namespaceInfo.active,
		aliastype: aliasType,
		alias: aliasText,
    parentHexId: namespaceInfo.parentId.id.toHex(),
    parentName: namespaceInfo.type !== 0 ? namespaceInfo.name.split('.')[0] : '',
	};

	return namespaceObj;
}

const formatNamespaces = namespacesInfo =>
	namespacesInfo
		.filter((ns, index, namespaces) => {
			for (let i = 0; i < index; i += 1) {
				if (ns === namespaces[i]) return false;
			}
			return true;
		})
		.sort((a, b) => {
			const nameA = a.namespaceInfo.metaId;
			const nameB = b.namespaceInfo.metaId;
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		})
		.map((ns, index, original) => {
			const name = ns.namespaceInfo.levels
				.map(level => original.find(n => n.namespaceInfo.id.equals(level)))
				.map(n => n.namespaceName.name)
				.join('.');
			let aliasText;
			let aliasType;
			switch (ns.namespaceInfo.alias.type) {
				case 1:
					aliasText = new UInt64(ns.namespaceInfo.alias.mosaicId).toHex();
					aliasType = 'mosaic alias:';
					break;
				case 2:
					aliasText = Address.createFromEncoded(
						ns.namespaceInfo.alias.address
					).pretty();
					aliasType = 'address alias:';
					break;
				default:
					aliasText = false;
					aliasType = 'no alias';
					break;
			}
			return {
				owner: ns.namespaceInfo.owner,
				namespaceName: name,
				hexId: ns.namespaceInfo.id.toHex(),
				type:
					ns.namespaceInfo.type === 0 ? 'Root namespace' : 'Child namespace',
				aliastype: aliasType,
				alias: aliasText,
				aliasAction:
					ns.namespaceInfo.alias.type === 0
						? AliasActionType.Link
						: AliasActionType.Unlink,
				currentAliasType: ns.namespaceInfo.alias.type,

				active: ns.namespaceInfo.active,
				startHeight: ns.namespaceInfo.startHeight.compact(),
				endHeight: ns.namespaceInfo.endHeight.compact(),
				parentId: ns.namespaceInfo.parentId.id.toHex(),
			};
		});

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
  formatNamespace
};
