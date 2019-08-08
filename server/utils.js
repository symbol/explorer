const { TransactionType } = require('nem2-sdk');
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

function formatTx(tx) {
	switch (tx.type) {
		case TransactionType.TRANSFER:
			transferObj = {
				type: 'Transfer',
				typeId: TransactionType.TRANSFER,
				signer: tx.signer,
				recipient: tx.recipient,
				fee: tx.maxFee.compact(),
				blockNumber: tx.transactionInfo.height.compact(),
				transactionHash: tx.transactionInfo.hash,
				transactionId: tx.transactionInfo.id,
				deadline: moment(new Date(tx.deadline.value)).format(
					'YYYY-MM-DD HH:mm:ss'
				),
				mosaics: tx.mosaics,
				message: tx.message.payload,
			};
			return transferObj;
		case TransactionType.REGISTER_NAMESPACE:
      registerNamespaceObj = {

      }
      console.log(tx);
			return registerNamespaceObj;
		case TransactionType.ADDRESS_ALIAS:
			return 'Address alias';
		case TransactionType.MOSAIC_ALIAS:
			return 'Mosaic alias';
		case TransactionType.MOSAIC_DEFINITION:
			return 'Mosaic definition';
		case TransactionType.MOSAIC_SUPPLY_CHANGE:
			return 'Mosaic supply change';
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
			return formatTx(tx);
		});
	}
	return;
}

module.exports = {
	getNodeEndPoint,
	formatBlock,
	formatBlocks,
	formatTxs,
};
