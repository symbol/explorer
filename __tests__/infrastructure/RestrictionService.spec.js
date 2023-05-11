import { RestrictionService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { MosaicId, MosaicRestrictionType, UInt64 } from 'symbol-sdk';

// Arrange:
jest.mock('../../src/infrastructure/http', () => {
	const {
		MosaicId,
		Address,
		TransactionType,
		AddressRestrictionFlag,
		MosaicRestrictionFlag,
		OperationRestrictionFlag
	} = require('symbol-sdk');

	const createAccountRestriction = (restrictionFlag, value) => {
		return {
			restrictionFlags: restrictionFlag,
			values: [value]
		};
	};

	const addressRestriction = Address.createFromRawAddress('TAF4PFLYK6R3JTKU5SQ5LWG7YUO56BBKHJHBLJY');
	const mosaicRestriction = new MosaicId('3A8416DB2D53B6C8');

	return {
		createRepositoryFactory: {
			createRestrictionAccountRepository: () => {
				return {
					getAccountRestrictions: address => {
						if ('TB2ZGMKWLBZ62VAXP2NPMEQL44UWMADDET6HW6Y' === address.plain()) {
							return {
								toPromise: () => {
									return {
										version: 1,
										address: Address.createFromRawAddress('TB2ZGMKWLBZ62VAXP2NPMEQL44UWMADDET6HW6Y'),
										restrictions: [
											createAccountRestriction(
												AddressRestrictionFlag.AllowIncomingAddress,
												addressRestriction
											),
											createAccountRestriction(
												AddressRestrictionFlag.AllowOutgoingAddress,
												addressRestriction
											),
											createAccountRestriction(
												AddressRestrictionFlag.BlockIncomingAddress,
												addressRestriction
											),
											createAccountRestriction(
												AddressRestrictionFlag.BlockOutgoingAddress,
												addressRestriction
											),
											createAccountRestriction(
												MosaicRestrictionFlag.AllowMosaic,
												mosaicRestriction
											),
											createAccountRestriction(
												MosaicRestrictionFlag.BlockMosaic,
												mosaicRestriction
											),
											createAccountRestriction(
												OperationRestrictionFlag.AllowOutgoingTransactionType,
												TransactionType.TRANSFER
											),
											createAccountRestriction(
												OperationRestrictionFlag.BlockOutgoingTransactionType,
												TransactionType.TRANSFER
											)
										]
									};
								}
							};
						}
					}
				};
			}
		}
	};
});

describe('RestrictionService', () => {
	describe('formatMosaicGlobalRestriction', () => {
		const runBasicMosaicGlobalRestrictionTests = (restrictionType, expectedResult) => {
			const createMosaicGlobalRestriction = referenceMosaicId => {
				return {
					compositeHash: 'E040D414A6F2E083EC4EBC5060461385E71392F292D6D25ADF7F1CBD0C24CE99',
					entryType: 1,
					mosaicId: new MosaicId('1788BA84888894EB'),
					restrictions: [{
						key: UInt64.fromUint(790526),
						referenceMosaicId,
						restrictionType: restrictionType.type,
						restrictionValue: UInt64.fromUint(10)
					}],
					version: 1
				};
			};

			it(`returns mosaic global restriction dto with type ${restrictionType.name} and with self reference mosaic`, () => {
				// Arrange:
				const mosaicGlobalRestriction = createMosaicGlobalRestriction(new MosaicId('0'.repeat(16)));

				// Act:
				const result = RestrictionService.formatMosaicGlobalRestriction(mosaicGlobalRestriction);

				// Assert:
				expect(result).toEqual({
					compositeHash: mosaicGlobalRestriction.compositeHash,
					version: 1,
					entryType: 'Mosaic global restriction',
					mosaicId: '1788BA84888894EB',
					restrictions: [{
						restrictionKey: '790526',
						restrictionType: expectedResult,
						restrictionValue: '10',
						referenceMosaicId: '1788BA84888894EB'
					}]
				});
			});

			it(`returns mosaic global restriction dto with type ${restrictionType.name} and reference mosaic`, () => {
				// Arrange:
				const mosaicGlobalRestriction = createMosaicGlobalRestriction(new MosaicId('0845619DCCC7C163'));

				// Act:
				const result = RestrictionService.formatMosaicGlobalRestriction(mosaicGlobalRestriction);

				// Assert:
				expect(result).toEqual({
					compositeHash: mosaicGlobalRestriction.compositeHash,
					version: 1,
					entryType: 'Mosaic global restriction',
					mosaicId: '1788BA84888894EB',
					restrictions: [{
						restrictionKey: '790526',
						restrictionType: expectedResult,
						restrictionValue: '10',
						referenceMosaicId: '0845619DCCC7C163'
					}]
				});
			});
		};

		// Arrange:
		const data = [
			{
				restrictionType: {
					type: MosaicRestrictionType.EQ,
					name: 'equal'
				},
				expectedResult: 'mosaicRestrictionType.EQ'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.GE,
					name: 'great equal'
				},
				expectedResult: 'mosaicRestrictionType.GE'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.GT,
					name: 'greater than'
				},
				expectedResult: 'mosaicRestrictionType.GT'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.LE,
					name: 'less equal'
				},
				expectedResult: 'mosaicRestrictionType.LE'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.LT,
					name: 'less than'
				},
				expectedResult: 'mosaicRestrictionType.LT'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.NE,
					name: 'not equal'
				},
				expectedResult: 'mosaicRestrictionType.NE'
			},
			{
				restrictionType: {
					type: MosaicRestrictionType.NONE,
					name: 'no restriction'
				},
				expectedResult: 'mosaicRestrictionType.NONE'
			}
		];

		data.forEach(info => {
			runBasicMosaicGlobalRestrictionTests(info.restrictionType, info.expectedResult);
		});
	});

	describe('formatMosaicAddressRestriction', () => {
		it('returns mosaic address restriction dto', () => {
			// Arrange:
			const targetAddress = TestHelper.generateAccount(1)[0].address;

			const mosaicGlobalRestriction = {
				compositeHash: 'E040D414A6F2E083EC4EBC5060461385E71392F292D6D25ADF7F1CBD0C24CE99',
				entryType: 0,
				mosaicId: new MosaicId('1788BA84888894EB'),
				restrictions: [{
					key: UInt64.fromUint(790526),
					restrictionValue: UInt64.fromUint(10)
				}],
				targetAddress,
				version: 1
			};

			// Act:
			const result = RestrictionService.formatMosaicAddressRestriction(mosaicGlobalRestriction);

			// Assert:
			expect(result).toEqual({
				compositeHash: mosaicGlobalRestriction.compositeHash,
				version: 1,
				entryType: 'Mosaic address restriction',
				mosaicId: '1788BA84888894EB',
				restrictions: [{
					restrictionKey: '790526',
					restrictionValue: '10'
				}],
				targetAddress: targetAddress.plain()
			});
		});
	});

	describe('getAccountRestrictions', () => {
		it('returns account restrictions dto', async () => {
			// Arrange + Act:
			const result = await RestrictionService.getAccountRestrictions('TB2ZGMKWLBZ62VAXP2NPMEQL44UWMADDET6HW6Y');

			// Assert:
			const expectedRestrictionAddress = [
				'Allow Incoming Addresses',
				'Allow Outgoing Addresses',
				'Block Incoming Addresses',
				'Block Outgoing Addresses'
			];

			const expectedRestrictionMosaic = [
				'Allow Mosaics',
				'Block Mosaics'
			];

			const expectedRestrictionOperation = [
				'Allow Outgoing Transactions',
				'Block Outgoing Transactions'
			];

			expect(result).toEqual([
				...expectedRestrictionAddress.map(restriction => {
					return {
						restrictionType: restriction,
						restrictionAddressValues: ['TAF4PFLYK6R3JTKU5SQ5LWG7YUO56BBKHJHBLJY']
					};
				}),
				...expectedRestrictionMosaic.map(restriction => {
					return {
						restrictionType: restriction,
						restrictionMosaicValues: ['3A8416DB2D53B6C8']
					};
				}),
				...expectedRestrictionOperation.map(restriction => {
					return {
						restrictionType: restriction,
						restrictionTransactionValues: ['Transfer']
					};
				})
			]);
		});

		it('throws error when account restrictions are not available', () => {
			// Arrange:
			const nonRestrictionsAccount = TestHelper.generateAccount(1)[0].address.plain();

			// Act: + Assert:
			expect(async () => {
				await RestrictionService.getAccountRestrictions(nonRestrictionsAccount).toThrow();
			});
		});
	});
});
