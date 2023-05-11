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

import http from './http';
import { Constants } from '../config';
import helper from '../helper';
import {
	AccountService,
	NodeService,
	ReceiptService,
	TransactionService
} from '../infrastructure';
import { sha3_256 as sha3256 } from 'js-sha3';
import { MerkleTree } from 'merkletreejs';
import { take, toArray } from 'rxjs/operators';
import {
	BlockOrderBy,
	BlockType,
	Order,
	ReceiptType,
	TransactionGroup,
	UInt64
} from 'symbol-sdk';

class BlockService {
	/**
	 * Gets a BlockInfo for a given block height.
	 * @param {number} height block height.
	 * @returns {object} Formatted BlockDTO.
	 */
	static getBlockByHeight = async height => {
		const blockInfo = await http.createRepositoryFactory
			.createBlockRepository()
			.getBlockByHeight(UInt64.fromUint(height))
			.toPromise();

		return this.formatBlock(blockInfo);
	};

	/**
	 * Gets a blocks from searchCriteria.
	 * @param {object} blockSearchCriteria Block Search Criteria.
	 * @returns {object} formatted block data with pagination info.
	 */
	static searchBlocks = async blockSearchCriteria => {
		const searchBlocks = await http.createRepositoryFactory
			.createBlockRepository()
			.search(blockSearchCriteria)
			.toPromise();

		return {
			...searchBlocks,
			data: searchBlocks.data.map(block => this.formatBlock(block))
		};
	};

	/**
	 * Gets a blocks from streamer.
	 * @param {object} searchCriteria - Object  Search Criteria.
	 * @param {number} noOfBlock - Number of blocks returned.
	 * @returns {array} formatted BlockInfos.
	 */
	static streamerBlocks = async (searchCriteria, noOfBlock) => {
		const streamerBlocks = await http.blockPaginationStreamer
			.search(searchCriteria)
			.pipe(take(noOfBlock), toArray())
			.toPromise();

		return streamerBlocks.map(block => this.formatBlock(block));
	};

	/**
	 * Gets a merkle path for merkle proof.
	 * @param {number} height - block height.
	 * @param {string} hash Transaction hash.
	 * @returns {array} MerkleProofInfos
	 */
	static getMerkleTransaction = async (height, hash) => {
		const merklePath = await http.createRepositoryFactory
			.createBlockRepository()
			.getMerkleTransaction(UInt64.fromUint(height), hash)
			.toPromise();

		return merklePath.merklePath || [];
	};

	/**
	 * Gets transactions a merkle tree.
	 * @param {number} height - block height.
	 * @returns {object} merkleTree object.
	 */
	static getMerkleTransactionTree = async height => {
		const searchCriteria = {
			group: TransactionGroup.Confirmed,
			height: UInt64.fromUint(height),
			pageSize: 100,
			order: Order.Desc
		};

		const streamerTransactions = await TransactionService.streamerTransactions(searchCriteria);
		const transactions = streamerTransactions.map(transaction =>
			TransactionService.formatTransaction(transaction));

		const leaves = transactions
			.sort((n1, n2) => n1.transactionInfo.index - n2.transactionInfo.index)
			.map(transaction => transaction.transactionInfo.hash);

		const tree = new MerkleTree(leaves, sha3256, {
			duplicateOdd: true,
			hashLeaves: false,
			sort: false,
			sortLeaves: false,
			sortPairs: false,
			isBitcoinTree: false
		});

		return tree.getLayersAsObject();
	};

	/**
	 * Get formatted BlockInfo[] dataset into Vue Component.
	 * @param {object} pageInfo - pageNumber and pageSize.
	 * @returns {object} Block info list.
	 */
	static getBlockList = async pageInfo => {
		const { pageNumber, pageSize } = pageInfo;
		const blockSearchCriteria = {
			pageNumber,
			pageSize,
			order: Order.Desc,
			orderBy: BlockOrderBy.Height
		};

		const blocks = await this.searchBlocks(blockSearchCriteria);

		const signerAddress = blocks.data.map(block => block.signer);

		// Get Inflation rate
		const receiptSearchCriteria = {
			pageSize: blocks.data.length,
			order: Order.Desc,
			fromHeight: UInt64.fromUint(blocks.data[blocks.data.length - 1].height),
			toHeight: UInt64.fromUint(blocks.data[0].height),
			receiptTypes: [ReceiptType.Inflation]
		};

		const [accountInfos, { numBlocks }, balanceTransferReceipt] =
			await Promise.all([
				AccountService.getAccounts(signerAddress),
				NodeService.getStorageInfo(),
				ReceiptService.searchReceipts(receiptSearchCriteria)
			]);

		return {
			...blocks,
			totalRecords: numBlocks,
			data: blocks.data.map(block => {
				const { supplementalPublicKeys } = accountInfos.find(account => account.address === block.signer);
				const inflationRate =
					balanceTransferReceipt.data.inflationStatement.data.find(inflation =>
						Number(inflation.height.toString()) === block.height);
				const blockReward = Number(inflationRate?.amount.toString()) || 0;

				return {
					...block,
					age: helper.convertTimestampToDate(block.timestamp),
					blockReward: helper.toNetworkCurrency(blockReward),
					harvester: {
						signer: block.signer,
						linkedAddress:
							supplementalPublicKeys.linked === Constants.Message.UNAVAILABLE
								? block.signer
								: helper.publicKeyToAddress(supplementalPublicKeys.linked)
					}
				};
			})
		};
	};

	/**
	 * Get Custom Transactions dataset into Vue Component
	 * @param {object} pageInfo - page info such as pageNumber, pageSize
	 * @param {object} filterValue - search criteria
	 * @param {number} height -  block height
	 * @returns {object} Custom Transactions dataset
	 */
	static getBlockTransactionList = async (pageInfo, filterValue, height) => {
		const { pageNumber, pageSize } = pageInfo;
		const searchCriteria = {
			pageNumber,
			pageSize,
			order: Order.Desc,
			type: [],
			group: TransactionGroup.Confirmed,
			height: UInt64.fromUint(height),
			...filterValue
		};

		const [blockInfo, searchTransactions] = await Promise.all([
			BlockService.getBlockInfo(height),
			TransactionService.searchTransactions(searchCriteria)
		]);

		const blockTransactions = {
			...searchTransactions,
			data: searchTransactions.data.map(transaction =>
				TransactionService.formatTransaction(transaction))
		};

		return {
			...blockTransactions,
			data: blockTransactions.data.map(blockTransaction => ({
				...blockTransaction,
				timestamp: blockInfo.timestamp,
				transactionHash: blockTransaction.transactionInfo.hash,
				transactionType: blockTransaction.type
			}))
		};
	};

	/**
	 * Gets formatted Receipt and Resolution statements.
	 * @param {number} height - block height.
	 * @returns {object} Receipt and Resolution info object.
	 */
	static getBlockReceiptsInfo = async height => {
		const searchCriteria = {
			order: Order.Desc,
			height: UInt64.fromUint(height)
		};

		const [address, mosaic] = await Promise.all([
			ReceiptService.streamerAddressResolution(searchCriteria),
			ReceiptService.streamerMosaicResolution(searchCriteria)
		]);

		return {
			resolutionStatements: [...address, ...mosaic]
		};
	};

	/**
	 * Get formatted BlockInfo dataset into Vue Component.
	 * @param {number} height - block height.
	 * @returns {object} block info object.
	 */
	static getBlockInfo = async height => {
		const block = await this.getBlockByHeight(height);

		const { supplementalPublicKeys } = await AccountService.getAccount(block.signer);

		// Get merkle info
		let {
			stateHash,
			stateHashSubCacheMerkleRoots,
			blockReceiptsHash,
			blockTransactionsHash
		} = block;

		// Append merkle root name into hash
		stateHashSubCacheMerkleRoots = stateHashSubCacheMerkleRoots.map((root, index) => {
			return `${Constants.MerkleRootsOrder[index]} - ${root}`;
		});

		let importanceBlockInfo = {};

		if (block.type === BlockType.ImportanceBlock) {
			Object.assign(importanceBlockInfo, {
				totalVotingBalance: helper.toNetworkCurrency(block.totalVotingBalance),
				harvestingEligibleAccountsCount: Number(block.harvestingEligibleAccountsCount)
			});
		}

		return {
			...block,
			...importanceBlockInfo,
			symbolTime: block.timestamp,
			payloadSize: block.size,
			blockHash: block.hash,
			harvester: {
				signer: block.signer,
				linkedAddress:
					supplementalPublicKeys.linked === Constants.Message.UNAVAILABLE
						? block.signer
						: helper.publicKeyToAddress(supplementalPublicKeys.linked)
			},
			merkleInfo: {
				stateHash,
				stateHashSubCacheMerkleRoots,
				blockReceiptsHash,
				blockTransactionsHash
			}
		};
	};

	/**
	 * Gets block receipt list into Vue Component.
	 * @param {object} pageInfo - page info such as pageNumber, pageSize.
	 * @param {object} filterValue - search criteria.
	 * @param {number} height - block height.
	 * @returns {object} formatted receipt data list
	 */
	static getBlockReceiptList = async (pageInfo, filterValue, height) => {
		const { pageNumber, pageSize } = pageInfo;

		const {
			BalanceTransferReceipt,
			BalanceChangeReceipt,
			InflationReceipt,
			ArtifactExpiryReceipt
		} = Constants.ReceiptTransactionStatementType;

		const searchCriteria = {
			pageNumber,
			pageSize,
			order: Order.Desc,
			height: UInt64.fromUint(height),
			...filterValue
		};

		const receipt = await ReceiptService.searchReceipts(searchCriteria);

		let formattedReceipt = [];

		switch (filterValue.receiptTransactionStatementType) {
		case BalanceTransferReceipt:
			formattedReceipt =
					await ReceiptService.createReceiptTransactionStatement(receipt.data.balanceTransferStatement);
			break;
		case BalanceChangeReceipt:
			formattedReceipt =
					await ReceiptService.createReceiptTransactionStatement(receipt.data.balanceChangeStatement);
			break;
		case InflationReceipt:
			formattedReceipt =
					await ReceiptService.createReceiptTransactionStatement(receipt.data.inflationStatement);
			break;
		case ArtifactExpiryReceipt:
			formattedReceipt =
					await ReceiptService.createReceiptTransactionStatement(receipt.data.artifactExpiryStatement);
			break;
		default:
			break;
		}

		return {
			...receipt,
			data: formattedReceipt
		};
	};

	/**
	 * Format Block to readable Block object.
	 * @param {object} block BlockDTO.
	 * @returns {object} readable BlockDTO object.
	 */
	static formatBlock = block => ({
		...block,
		blockType: Constants.BlockType[block.type],
		height: block.height.compact(),
		timestampRaw: Number(block.timestamp.toString()),
		timestamp: helper.networkTimestamp(Number(block.timestamp.toString())),
		totalFee: helper.toNetworkCurrency(block.totalFee),
		difficulty: helper.convertBlockDifficultyToReadable(block.difficulty),
		feeMultiplier: block.feeMultiplier.toString(),
		totalTransactions: block.totalTransactionsCount,
		statements: block.statementsCount,
		transactions: block.transactionsCount,
		signer: helper.publicKeyToAddress(block.signer.publicKey),
		beneficiaryAddress:
			block?.beneficiaryAddress.plain() || Constants.Message.UNAVAILABLE
	});
}

export default BlockService;
