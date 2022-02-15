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
import { NamespaceService, MetadataService, ReceiptService } from '../infrastructure';
import { Address, MosaicId, Order, ReceiptType, UInt64 } from 'symbol-sdk';

class MosaicService {
	/**
   * Gets MosaicInfo for different mosaicIds.
   * @param {array} mosaicIds - Array of mosaic ids.
   * @returns {array} Formatted MosaicInfos.
   */
   static getMosaics = async mosaicIds => {
   	const mosaics = await http.createRepositoryFactory.createMosaicRepository()
   		.getMosaics(mosaicIds)
   		.toPromise();
   	const formattedMosaics = mosaics.map(mosaic => this.formatMosaicInfo(mosaic));

   	return formattedMosaics;
   }

   /**
   * Gets the MosaicInfo for a given mosaicId.
   * @param {object} mosaicId -  Mosaic id
   * @returns {object} Formatted MosaicInfo
   */
   static getMosaic = async mosaicId => {
   	const mosaic = await http.createRepositoryFactory.createMosaicRepository()
   		.getMosaic(mosaicId)
   		.toPromise();

   	const formattedMosaic = this.formatMosaicInfo(mosaic);

   	return formattedMosaic;
   }

   /**
    * Get balance mosaics in form of MosaicAmountViews for a given account address.
    * @param {string} address - Account address
    * @returns {array} formatted MosaicAmountViews
    */
   static getMosaicAmountView = async address => {
   	const mosaicAmountViews = await http.mosaicService.mosaicsAmountViewFromAddress(Address.createFromRawAddress(address)).toPromise();

   	return mosaicAmountViews.map(mosaicAmountView => this.formatMosaicAmountView(mosaicAmountView));
   }

   /**
   * Gets a mosaics list from searchCriteria.
   * @param {object} mosaicSearchCriteria Search Criteria.
   * @returns {object} formatted mosaic data with pagination info.
   */
  static searchMosaics = async mosaicSearchCriteria => {
  	const searchMosaics = await http.createRepositoryFactory.createMosaicRepository()
  		.search(mosaicSearchCriteria)
  		.toPromise();

  	return {
  		...searchMosaics,
  		data: searchMosaics.data.map(mosaic => this.formatMosaicInfo(mosaic))
  	};
  }

   /**
    * Get formatted MosaicInfo dataset into Vue Component.
    * @param {string} hexOrNamespace - hex value or namespace name.
    * @returns {object} MosaicInfo info object.
    */
   static getMosaicInfo = async hexOrNamespace => {
   	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');
   	const mosaicInfo = await this.getMosaic(mosaicId);

   	const mosaicNames = await NamespaceService.getMosaicsNames([mosaicId]);

   	const expiredInBlock = mosaicInfo.duration + mosaicInfo.startHeight;

   	return {
   		...mosaicInfo,
   		mosaicAliasNames: this.extractMosaicNamespace(mosaicInfo, mosaicNames),
   		expiredInBlock: expiredInBlock === mosaicInfo.startHeight ? Constants.Message.INFINITY : expiredInBlock
   	};
   }

   /**
    * Get custom MosaicInfo dataset into Vue Component.
    * @param {object} pageInfo - pagination info.
    * @returns {object} Custom MosaicInfos
    */
   static getMosaicList = async pageInfo => {
   	const { pageNumber, pageSize } = pageInfo;
   	const searchCriteria = {
   		pageNumber,
   		pageSize,
   		order: Order.Desc
   	};

   	const mosaicInfos = await this.searchMosaics(searchCriteria);

   	const mosaicIdsList = mosaicInfos.data.map(mosaicInfo => new MosaicId(mosaicInfo.mosaicId));

   	const mosaicNames = await NamespaceService.getMosaicsNames(mosaicIdsList);

   	return {
   		...mosaicInfos,
   		data: mosaicInfos.data.map(mosaic => ({
   			...mosaic,
   			ownerAddress: mosaic.address,
   			mosaicAliasNames: this.extractMosaicNamespace(mosaic, mosaicNames),
   			mosaicFlags: {
   				supplyMutable: mosaic.supplyMutable,
   				transferable: mosaic.transferable,
   				restrictable: mosaic.restrictable,
   				revokable: mosaic.revokable
   			}
   		}))
   	};
   }

   /**
    * Get customize MosaicAmountView dataset for Vue component.
    * @param {string} address - Account address.
    * @returns {object} customize MosaicAmountViews.
    */
   static getMosaicAmountViewList = async address => {
   	const mosaicAmountViewInfos = await this.getMosaicAmountView(address);

   	const mosaicIdsList = mosaicAmountViewInfos.map(mosaicAmountViewInfo => new MosaicId(mosaicAmountViewInfo.mosaicId));
   	const mosaicNames = await NamespaceService.getMosaicsNames(mosaicIdsList);

   	return mosaicAmountViewInfos.map(mosaicAmountViewInfo => ({
   		...mosaicAmountViewInfo,
   		mosaicAliasNames: this.extractMosaicNamespace(mosaicAmountViewInfo, mosaicNames)
   	}));
   }

   /**
   * Gets mosaic Metadata list dataset into Vue component.
   * @param {object} pageInfo - page info such as pageNumber, pageSize.
   * @param {object} filterValue - search criteria.
   * @param {string} hexOrNamespace - hex value or namespace name.
   * @returns {object} formatted mosaic Metadata list.
   */
   static getMosaicMetadataList = async (pageInfo, filterValue, hexOrNamespace) => {
   	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');

   	const { pageNumber, pageSize } = pageInfo;

   	const searchCriteria = {
   		pageNumber,
   		pageSize,
   		order: Order.Desc,
   		targetId: mosaicId,
   		...filterValue
   	};
   	const mosaicMetadatas = await MetadataService.searchMetadatas(searchCriteria);

   	return mosaicMetadatas;
   }

   /**
	* Gets mosaic balance transfer receipt list dataset into Vue component.
	* @param {object} pageInfo - page info such as pageNumber, pageSize.
	* @param {string} hexOrNamespace - hex value or namespace name.
	* @returns {object} formatted balance transfer receipt list.
	*/
   static getMosaicBalanceTransferReceipt = async (pageInfo, hexOrNamespace) => {
   	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');

   	const { startHeight, address } = await this.getMosaic(mosaicId);

   	const { pageNumber, pageSize } = pageInfo;

   	const searchCriteria = {
   		pageNumber,
   		pageSize,
   		order: Order.Desc,
   		height: UInt64.fromUint(startHeight),
   		receiptTypes: [ReceiptType.Mosaic_Rental_Fee],
   		senderAddress: Address.createFromRawAddress(address)
   	};

   	const balanceTransferReceipt = await ReceiptService.searchReceipts(searchCriteria);

   	const formattedReceipt = await ReceiptService.createReceiptTransactionStatement(balanceTransferReceipt.data.balanceTransferStatement);

   	return {
   		...balanceTransferReceipt,
   		data: formattedReceipt.filter(receipt =>
   			receipt.senderAddress === address &&
         receipt.type === ReceiptType.Mosaic_Rental_Fee)
   	};
   }

   /**
	* Gets mosaic artifact expiry receipt list dataset into Vue component.
	* @param {object} pageInfo - page info such as pageNumber, pageSize.
	* @param {string} hexOrNamespace - hex value or namespace name.
	* @returns {object} formatted artifact expiry receipt list.
	*/
   static getMosaicArtifactExpiryReceipt = async (pageInfo, hexOrNamespace) => {
   	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');

   	const { startHeight, duration } = await this.getMosaic(mosaicId);

   	const { pageNumber, pageSize } = pageInfo;

   	const endHeight = startHeight + duration;

   	if (endHeight === startHeight)
   		return {};

   	// Todo: Should filter with with ArtifactId rather than height.
   	// Bug: https://github.com/nemtech/catapult-rest/issues/517
   	const searchCriteria = {
   		pageNumber,
   		pageSize,
   		order: Order.Desc,
   		height: UInt64.fromUint(endHeight),
   		receiptTypes: [ReceiptType.Mosaic_Expired]
   	};

   	const artifactExpiryReceipt = await ReceiptService.searchReceipts(searchCriteria);
   	const formattedReceipt = await ReceiptService.createReceiptTransactionStatement(artifactExpiryReceipt.data.artifactExpiryStatement);

   	return {
   		...artifactExpiryReceipt,
   		data: formattedReceipt.filter(receipt => receipt.type === ReceiptType.Mosaic_Expired)
   	};
   }

   /**
    * Format MosaicInfo to readable mosaicInfo object.
    * @param {object} mosaicInfo MosaicInfoDTO.
    * @returns {object} readable MosaicInfoDTO object.
    */
   static formatMosaicInfo = mosaicInfo => ({
   	mosaicId: mosaicInfo.id.toHex(),
   	divisibility: mosaicInfo.divisibility,
   	address: mosaicInfo.ownerAddress.plain(),
   	supply: mosaicInfo.supply.compact().toLocaleString('en-US'),
   	relativeAmount: helper.formatMosaicAmountWithDivisibility(mosaicInfo.supply, mosaicInfo.divisibility),
   	revision: mosaicInfo.revision,
   	startHeight: Number(mosaicInfo.startHeight.toString()),
   	duration: Number(mosaicInfo.duration.toString()),
   	supplyMutable: mosaicInfo.flags.supplyMutable,
   	transferable: mosaicInfo.flags.transferable,
   	restrictable: mosaicInfo.flags.restrictable,
   	revokable: mosaicInfo.flags.revokable
   })

   /**
    * format MosaicAmountView to readable object.
    * @param {object} mosaicAmountView - mosaicAmountView DTO.
    * @returns {object} formatted mosaicAmountView.
    */
   static formatMosaicAmountView = mosaicAmountView => ({
   	...this.formatMosaicInfo(mosaicAmountView.mosaicInfo),
   	amount: helper.formatMosaicAmountWithDivisibility(mosaicAmountView.amount, mosaicAmountView.mosaicInfo.divisibility)
   })

   /**
    * Extract Name for Mosaic.
    * @param {object} mosaicInfo - mosaicInfo DTO.
    * @param {array} mosaicNames - MosaicNames[].
    * @returns {array} mosaicNames.
    */
   static extractMosaicNamespace = (mosaicInfo, mosaicNames) => {
   	const mosaicName = mosaicNames.find(name => name.mosaicId === mosaicInfo.mosaicId);

   	const aliasNames = mosaicName.names.map(names => names.name);

   	const names = 0 < aliasNames.length ? aliasNames : [Constants.Message.UNAVAILABLE];

   	return names;
   }
}

export default MosaicService;
