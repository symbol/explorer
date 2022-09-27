import { RestrictionService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { MosaicId, UInt64, MosaicRestrictionType, Address } from 'symbol-sdk';

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
});
