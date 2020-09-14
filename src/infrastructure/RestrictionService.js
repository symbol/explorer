import http from './http';
import {
	Address,
	AddressRestrictionFlag,
	MosaicRestrictionFlag,
	OperationRestrictionFlag,
	MosaicAddressRestriction,
	MosaicGlobalRestriction
} from 'symbol-sdk';
import helper from '../helper';
import Constants from '../config/constants';

class RestrictionService {
  /**
   * Get Account Restriction from symbol SDK
   * @param address - Account address to be created from PublicKey or RawAddress
   * @returns AccountRestrictions[]
   */
  static getAccountRestrictions = async address => {
  	let accountRestrictions;

  	try {
  		accountRestrictions = await http.createRepositoryFactory.createRestrictionAccountRepository()
  			.getAccountRestrictions(Address.createFromRawAddress(address))
  			.toPromise();
  	}
  	catch (e) {
  		// To Catach statusCode 404 if Account restrictions are not available.
  		throw Error('Account restrictions are not available.');
  	}

  	const formattedAccountRestrictions = accountRestrictions.map(accountRestriction => this.formatAccountRestriction(accountRestriction));

  	return formattedAccountRestrictions;
  }

  /**
   * Gets a mosaic restrictions list from searchCriteria
   * @param restrictionMosaicSearchCriteria Object of Search Criteria
   * @returns formatted namespace data with pagination info
   */
  static searchMosaicRestrictions = async restrictionMosaicSearchCriteria => {
  	const searchMosaicRestrictions = await http.createRepositoryFactory.createRestrictionMosaicRepository()
  		.searchMosaicRestrictions(restrictionMosaicSearchCriteria)
  		.toPromise();

  	return {
  		...searchMosaicRestrictions,
  		data: searchMosaicRestrictions.data.map(mosaicRestriction => {
  			if (mosaicRestriction instanceof MosaicAddressRestriction)
				  return this.formatMosaicAddressRestriction(mosaicRestriction);

  			if (mosaicRestriction instanceof MosaicGlobalRestriction)
  				return this.formatMosaicGlobalRestriction(mosaicRestriction);
  		})
  	};
  }

  /**
   * Get Mosaic Global Restriction from symbol SDK
   * @param mosaicId - - Mosaic identifier
   * @returns MosaicGlobalRestriction
   */
  static getMosaicGlobalRestriction = async mosaicId => {
  	let mosaicGlobalRestriction;

  	try {
  		mosaicGlobalRestriction = await http.createRepositoryFactory.createRestrictionMosaicRepository()
  			.getMosaicGlobalRestriction(mosaicId)
  			.toPromise();
  	}
  	catch (e) {
  		// To Catach statusCode 404 if Mosaic global restrictions are not available.
  		throw Error('Mosaic global restrictions are not available.');
  	}

  	return this.formatMosaicGlobalRestriction(mosaicGlobalRestriction);
  }

  /**
   * Get Mosaic Address Restriction from symbol SDK
   * @param address - Account address to be created from PublicKey or RawAddress
   * @param mosaicId - Mosaic identifier
   * @returns MosaicAddressRestriction
   */
  static getMosaicAddressRestriction = async (mosaicId, address) => {
  	let mosaicAddressRestriction;

  	try {
  		mosaicAddressRestriction = await http.createRepositoryFactory.createRestrictionMosaicRepository()
  			.getMosaicAddressRestriction(mosaicId, Address.createFromRawAddress(address))
  			.toPromise();
  	}
  	catch (error) {
  		throw Error('Mosaic address restrictions are not available.');
  	}

  	return this.formatMosaicAddressRestriction(mosaicAddressRestriction);
  }

  /**
   * Format AccountRestriction to readable object
   * @param AccountRestrictionDTO
   * @returns Object readable AccountRestriction object
   */
  static formatAccountRestriction = accountRestriction => {
  	switch (accountRestriction.restrictionFlags) {
  	case AddressRestrictionFlag.AllowIncomingAddress:
  	case AddressRestrictionFlag.BlockIncomingAddress:
  	case AddressRestrictionFlag.AllowOutgoingAddress:
  	case AddressRestrictionFlag.BlockOutgoingAddress:
  		return {
  			restrictionType: Constants.AddressRestrictionFlag[accountRestriction.restrictionFlags],
  			restrictionAddressValues: accountRestriction.values.map(value => value.address)
  		};
  	case MosaicRestrictionFlag.AllowMosaic:
  	case MosaicRestrictionFlag.BlockMosaic:
  		return {
  			restrictionType: Constants.MosaicRestrictionFlag[accountRestriction.restrictionFlags],
  			restrictionMosaicValues: MosaicRestrictionFlag.values.map(value => value.id.toHex())
  		};
  	case OperationRestrictionFlag.AllowOutgoingTransactionType:
  	case OperationRestrictionFlag.BlockOutgoingTransactionType:
  		return {
  			restrictionType: Constants.OperationRestrictionFlag[accountRestriction.restrictionFlags],
  			restrictionTransactionValues: accountRestriction.values.map(value => Constants.TransactionType[value])
  		};
  	}
  }

  /**
   * Format MosaicGlobalRestrictions to readable object
   * @param MosaicGlobalRestrictionDTO
   * @returns Object readable MosaicGlobalRestrictions object
   */
  static formatMosaicGlobalRestriction = mosaicRestriction => {
  	let mosaicGlobalRestrictionItem = [];

  	// Convert Map<k,v> to Array
  	mosaicRestriction.restrictions.forEach((value, key) => {
  		mosaicGlobalRestrictionItem.push({ key, ...value });
  		return mosaicGlobalRestrictionItem;
  	});

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
  	};
  }

  /**
   * Format MosaicAddressRestriction to readable object
   * @param addressRestrictionDTO
   * @returns Custom address restriction object
   */
  static formatMosaicAddressRestriction = addressRestriction => {
  	let mosaicAddressRestrictionItem = [];

  	// Convert Map<k,v> to Array
  	addressRestriction.restrictions.forEach((value, key) => {
  		mosaicAddressRestrictionItem.push({ key, value });
	  });

  	return {
  		...addressRestriction,
  		entryType: Constants.MosaicRestrictionEntryType[addressRestriction.entryType],
  		mosaicId: addressRestriction.mosaicId.toHex(),
  		targetAddress: addressRestriction.targetAddress.address,
  		restrictions: mosaicAddressRestrictionItem.map(item => ({
  			restrictionKey: item.key,
  			restrictionValue: item.value
  		}))
  	};
  }

  /**
   * Format Account Restriction list dataset into Vue component
   * @param address - Address in string format.
   * @returns Account Restriction list
   */
  static getAccountRestrictionList = async (address) => {
  	const accountRestrictions = await this.getAccountRestrictions(address);

  	return accountRestrictions;
  }

  /**
   * Gets Mosaic Global Restriction info dataset into Vue component
   * @param hexOrNamespace - hex value or namespace name
   * @returns Formatted Mosaic Global Restriction info
   */
  static getMosaicGlobalRestrictionInfo = async (hexOrNamespace) => {
  	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');
  	const mosaicGlobalRestrictionMetadata = await this.getMosaicGlobalRestriction(mosaicId);

  	return mosaicGlobalRestrictionMetadata;
  }

  /**
   * Gets Mosaic Address Restriction info dataset into Vue component
   * @param hexOrNamespace - hex value or namespace name
   * @param address - Account address to be created from PublicKey or RawAddress
   * @returns Formatted Mosaic Address Restriction info
   */
  static getMosaicAddressRestrictionInfo = async (hexOrNamespace, address) => {
  	const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');
  	const mosaicAddressRestriction = await this.getMosaicAddressRestriction(mosaicId, address);

  	return mosaicAddressRestriction;
  }
}

export default RestrictionService;
