import http from './http';
import Constants from '../config/constants';
import helper from '../helper';
import {
	Address,
	AddressRestrictionFlag,
	MosaicAddressRestriction,
	MosaicGlobalRestriction,
	MosaicRestrictionEntryType,
	MosaicRestrictionFlag,
	OperationRestrictionFlag,
	Order
} from 'symbol-sdk';

class RestrictionService {
	/**
	 * Get Account Restriction from symbol SDK
	 * @param {string} address - Account address to be created from PublicKey or RawAddress
	 * @returns {array} AccountRestrictions[]
	 */
	static getAccountRestrictions = async address => {
		let accountRestrictions;

		try {
			accountRestrictions = await http.createRepositoryFactory
				.createRestrictionAccountRepository()
				.getAccountRestrictions(Address.createFromRawAddress(address))
				.toPromise();
		} catch (e) {
			// To catch statusCode 404
			throw Error('Account restrictions are not available.');
		}

		return accountRestrictions.restrictions.map(restriction =>
			this.formatAccountRestriction(restriction));
	};

	/**
	 * Gets a mosaic restrictions list from searchCriteria
	 * @param {object} restrictionMosaicSearchCriteria Object of Search Criteria
	 * @returns {object} formatted namespace data with pagination info
	 */
	static searchMosaicRestrictions = async restrictionMosaicSearchCriteria => {
		const searchMosaicRestrictions = await http.createRepositoryFactory
			.createRestrictionMosaicRepository()
			.search(restrictionMosaicSearchCriteria)
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
	};

	/**
	 * Format AccountRestriction to readable object.
	 * @param {object} accountRestriction account restriction dto.
	 * @returns {object} readable AccountRestriction object.
	 */
	static formatAccountRestriction = accountRestriction => {
		switch (accountRestriction.restrictionFlags) {
		case AddressRestrictionFlag.AllowIncomingAddress:
		case AddressRestrictionFlag.BlockIncomingAddress:
		case AddressRestrictionFlag.AllowOutgoingAddress:
		case AddressRestrictionFlag.BlockOutgoingAddress:
			return {
				restrictionType:
						Constants.AddressRestrictionFlag[
							accountRestriction.restrictionFlags
						],
				restrictionAddressValues: accountRestriction.values.map(value => value.address)
			};
		case MosaicRestrictionFlag.AllowMosaic:
		case MosaicRestrictionFlag.BlockMosaic:
			return {
				restrictionType:
						Constants.MosaicRestrictionFlag[
							accountRestriction.restrictionFlags
						],
				restrictionMosaicValues: accountRestriction.values.map(value =>
					value.id.toHex())
			};
		case OperationRestrictionFlag.AllowOutgoingTransactionType:
		case OperationRestrictionFlag.BlockOutgoingTransactionType:
			return {
				restrictionType:
						Constants.OperationRestrictionFlag[
							accountRestriction.restrictionFlags
						],
				restrictionTransactionValues: accountRestriction.values.map(value => Constants.TransactionType[value])
			};
		}
	};

	/**
	 * Format MosaicGlobalRestrictions to readable object.
	 * @param {object} mosaicRestriction mosaic global restriction dto.
	 * @returns {object } readable MosaicGlobalRestrictions object.
	 */
	static formatMosaicGlobalRestriction = mosaicRestriction => {
		return {
			...mosaicRestriction,
			entryType:
				Constants.MosaicRestrictionEntryType[mosaicRestriction.entryType],
			mosaicId: mosaicRestriction.mosaicId.toHex(),
			restrictions: mosaicRestriction.restrictions.map(item => ({
				restrictionKey: item.key.toString(),
				restrictionType: Constants.MosaicRestrictionType[item.restrictionType],
				restrictionValue: item.restrictionValue.toString(),
				referenceMosaicId:
					'0000000000000000' === item.referenceMosaicId.toHex()
						? mosaicRestriction.mosaicId.toHex()
						: item.referenceMosaicId.toHex()
			}))
		};
	};

	/**
	 * Format MosaicAddressRestriction to readable object.
	 * @param {object} addressRestriction address restriction dto.
	 * @returns {object} Custom address restriction object
	 */
	static formatMosaicAddressRestriction = addressRestriction => {
		return {
			...addressRestriction,
			entryType:
				Constants.MosaicRestrictionEntryType[addressRestriction.entryType],
			mosaicId: addressRestriction.mosaicId.toHex(),
			targetAddress: addressRestriction.targetAddress.address,
			restrictions: addressRestriction.restrictions.map(item => ({
				restrictionKey: item.key.toString(),
				restrictionValue: item.restrictionValue.toString()
			}))
		};
	};

	/**
	 * Format Account Restriction list dataset into Vue component
	 * @param {string} address - Address in string format.
	 * @returns {array} Account Restriction list
	 */
	static getAccountRestrictionList = async address => {
		const accountRestrictions = await this.getAccountRestrictions(address);

		return accountRestrictions;
	};

	/**
	 * Gets Mosaic Restriction list dataset into Vue component
	 * @param {object} pageInfo - page info such as pageNumber, pageSize
	 * @param {object} filterValue - search criteria eg. mosaic global or mosaic address
	 * @param {string} hexOrNamespace - hex value or namespace name
	 * @returns {array} formatted mosaic restriction list
	 */
	static getMosaicRestrictionList = async (
		pageInfo,
		filterValue,
		hexOrNamespace
	) => {
		const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic');

		const { pageNumber, pageSize } = pageInfo;

		const searchCriteria = {
			pageNumber,
			pageSize,
			order: Order.Desc,
			mosaicId: mosaicId,
			...filterValue
		};

		const mosaicRestrictions = await this.searchMosaicRestrictions(searchCriteria);

		return mosaicRestrictions;
	};

	/**
	 * Gets Mosaic Address Restriction list dataset into Vue component
	 * @param {object} pageInfo - object for page info such as pageNumber, pageSize
	 * @param {string} address - account Address
	 * @returns {array} formatted mosaic address restriction list
	 */
	static getMosaicAddressRestrictionList = async (pageInfo, address) => {
		const { pageNumber, pageSize } = pageInfo;

		const searchCriteria = {
			pageNumber,
			pageSize,
			order: Order.Desc,
			entryType: MosaicRestrictionEntryType.ADDRESS,
			targetAddress: Address.createFromRawAddress(address)
		};

		const addressRestrictions = await this.searchMosaicRestrictions(searchCriteria);

		return addressRestrictions;
	};
}

export default RestrictionService;
