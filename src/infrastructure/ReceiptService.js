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
import Constants from '../config/constants';
import {
	CreateReceiptTransaction
} from '../infrastructure';
import { take, toArray } from 'rxjs/operators';
import { ReceiptType, ResolutionType } from 'symbol-sdk';

class ReceiptService {
	/**
	 * Gets a Receipts from searchCriteria.
	 * @param {object} transactionStatementSearchCriteria Block Search Criteria.
	 * @returns {object} formatted Receipts data with pagination info.
	 */
  static searchReceipts = async transactionStatementSearchCriteria => {
  	const searchReceipts = await http.createRepositoryFactory.createReceiptRepository()
  		.searchReceipts(transactionStatementSearchCriteria)
  		.toPromise();

  	return {
  		...searchReceipts,
  		data: this.transactionStatementBuilder(searchReceipts.data)
  	};
  }

  	/**
	 * Gets a Address Resolution from searchCriteria.
	 * @param {object} resolutionStatementSearchCriteria Block Search Criteria.
	 * @returns {object} formatted address resolution data with pagination info.
	 */
  static searchAddressResolutionStatements = async resolutionStatementSearchCriteria => {
  	const searchAddressResolutionStatements = await http.createRepositoryFactory.createReceiptRepository()
  		.searchAddressResolutionStatements(resolutionStatementSearchCriteria)
  		.toPromise();

  	return {
  		...searchAddressResolutionStatements,
  		data: this.formatResolutionStatement(searchAddressResolutionStatements.data)
  	};
  }

  /**
	 * Gets a Mosaic Resolution from searchCriteria.
	 * @param {object} resolutionStatementSearchCriteria Block Search Criteria.
	 * @returns {object} formatted mosaic resolution data with pagination info.
	 */
  static searchMosaicResolutionStatements = async resolutionStatementSearchCriteria => {
  	const searchMosaicResolutionStatements = await http.createRepositoryFactory.createReceiptRepository()
  		.searchMosaicResolutionStatements(resolutionStatementSearchCriteria)
  		.toPromise();

  	return {
  		...searchMosaicResolutionStatements,
  		data: this.formatResolutionStatement(searchMosaicResolutionStatements.data)
  	};
  }

  /**
   * Gets a receipts from streamer.
   * @param {object} searchCriteria - Search Criteria.
   * @returns {array} formatted statementReceipt[]
   */
  static streamerReceipts = async searchCriteria => {
  	const streamerReceipts = await http.transactionStatementPaginationStreamer()
  		.search(searchCriteria)
  		.pipe(take(10), toArray())
  		.toPromise();

  	return this.transactionStatementBuilder(streamerReceipts);
  }

  /**
   * Gets a Address Resolution statement from streamer.
   * @param {object} searchCriteria - Search Criteria.
   * @returns {array} formatted statementAddressResolution[]
   */
	static streamerAddressResolution = async searchCriteria => {
		const streamerAddressResolution = await http.addressResolutionStatementPaginationStreamer()
			.search(searchCriteria)
			.pipe(take(10), toArray())
			.toPromise();

		return this.formatResolutionStatement(streamerAddressResolution);
	}

	 /**
   * Gets a Mosaic Resolution statement from streamer.
   * @param {object} searchCriteria - Search Criteria.
   * @returns {array} formatted statementMosaicResolution[]
   */
	static streamerMosaicResolution = async searchCriteria => {
		const streamerMosaicResolution = await http.mosaicResolutionStatementPaginationStreamer()
			.search(searchCriteria)
			.pipe(take(10), toArray())
			.toPromise();

		return this.formatResolutionStatement(streamerMosaicResolution);
	}

	static createReceiptTransactionStatement = async transactionStatement => {
		const { receiptTransactionStatementType } = transactionStatement;
		switch (receiptTransactionStatementType) {
		case Constants.ReceiptTransactionStatementType.BalanceChangeReceipt:
			return CreateReceiptTransaction.balanceChangeReceipt(transactionStatement.data);
		case Constants.ReceiptTransactionStatementType.BalanceTransferReceipt:
			return CreateReceiptTransaction.balanceTransferReceipt(transactionStatement.data);
		case Constants.ReceiptTransactionStatementType.ArtifactExpiryReceipt:
			return CreateReceiptTransaction.artifactExpiryReceipt(transactionStatement.data);
		case Constants.ReceiptTransactionStatementType.InflationReceipt:
			return CreateReceiptTransaction.inflationReceipt(transactionStatement.data);
		default:
			throw new Error('Unimplemented receipt transaction statement with type ' + receiptTransactionStatementType);
		}
	}

  /**
   * Format Receipt Statements.
   * @param {array} transactionStatement - List of transaction statement.
   * @returns {object} collection of receipts
   *
   */
  static groupTransactionStatement = transactionStatement => {
  	let balanceChangeReceipt = [];

  	let balanceTransferReceipt = [];

  	let inflationReceipt = [];

  	let artifactExpiryReceipt = [];

  	transactionStatement.forEach(statement => {
  		statement.receipts.forEach(receipt => {
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
  					height: statement.height
  				});
  				break;
  			case ReceiptType.Mosaic_Rental_Fee:
  			case ReceiptType.Namespace_Rental_Fee:
  				balanceTransferReceipt.push({
  					...receipt,
  					height: statement.height
  				});
  				break;
  			case ReceiptType.Mosaic_Expired:
  			case ReceiptType.Namespace_Expired:
  			case ReceiptType.Namespace_Deleted:
  				artifactExpiryReceipt.push({
  					...receipt,
  					height: statement.height
  				});
  				break;
  			case ReceiptType.Inflation:
  				inflationReceipt.push({
  					...receipt,
  					height: statement.height
  				});
  				break;
  			}
  		});
	  });

  	return {
  		balanceChangeReceipt,
  		balanceTransferReceipt,
  		inflationReceipt,
  		artifactExpiryReceipt
  	};
  }

  static transactionStatementBuilder (transactionStatement) {
	  const {
		  balanceChangeReceipt,
		  balanceTransferReceipt,
		  inflationReceipt,
		  artifactExpiryReceipt
  	} = this.groupTransactionStatement(transactionStatement);

  	return {
  		balanceChangeStatement: {
  			receiptTransactionStatementType: Constants.ReceiptTransactionStatementType.BalanceChangeReceipt,
  			data: balanceChangeReceipt
  		},
  		balanceTransferStatement: {
  			receiptTransactionStatementType: Constants.ReceiptTransactionStatementType.BalanceTransferReceipt,
  			data: balanceTransferReceipt
  		},
  		inflationStatement: {
  			receiptTransactionStatementType: Constants.ReceiptTransactionStatementType.InflationReceipt,
  			data: inflationReceipt
  		},
  		artifactExpiryStatement: {
  			receiptTransactionStatementType: Constants.ReceiptTransactionStatementType.ArtifactExpiryReceipt,
  			data: artifactExpiryReceipt
  		}
  	};
  }

  /**
   * Format Resolution Statements
   * @param {array} resolutionStatement - list of resolution statement.
   * @returns {object} Address Resolution | Mosaic Resolution
   */
  static formatResolutionStatement = resolutionStatement => {
	  return resolutionStatement.map(statement => {
  		if (statement.resolutionType === ResolutionType.Address) {
  			return {
  				...statement,
  				height: statement.height.compact(),
  				resolutionType: Constants.ResolutionType[statement.resolutionType],
  				unresolved: statement.unresolved.toHex(),
  				addressResolutionEntries: statement.resolutionEntries.map(resolutionEntry => resolutionEntry.resolved.address)
  			};
  		}

  		if (statement.resolutionType === ResolutionType.Mosaic) {
  			return {
  				...statement,
  				resolutionType: Constants.ResolutionType[statement.resolutionType],
  				unresolved: statement.unresolved.toHex(),
  				mosaicResolutionEntries: statement.resolutionEntries.map(resolutionEntry => resolutionEntry.resolved.toHex())
  			};
  		}
	  });
  }
}

export default ReceiptService;
