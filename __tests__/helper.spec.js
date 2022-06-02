import TestHelper from './TestHelper';
import Helper from '../src/helper';
import { register, unregister } from 'timezone-mock';
import { MosaicService, NamespaceService } from '../src/infrastructure';
import http from '../src/infrastructure/http';
import { stub, restore } from 'sinon';
import { Mosaic, MosaicId, UInt64, NamespaceId } from 'symbol-sdk';

const mockTestMosaicHex = '6B2E9EAF2632AEC8';

describe('Helper', () => {
	describe('hslToRgb should', () => {
		it('return rgb', () => {
			// Arrange:
			const hue = 0.77;
			const saturation = 0.9;
			const lightness = 0.8;

			// Act:
			const rgb = Helper.hslToRgb(hue, saturation, lightness);

			// Assert:
			expect(rgb).toEqual({R: 215, G: 158, B: 250});
		});
	});

	describe('convertTimestampToDate', () => {
		// Arrange:
		const networkTimestamp = 1615853185;

		const expectedDateTime = {
			local: '2021-03-16 08:06:25',
			UTC: '2021-03-16 00:06:25'
		};

		beforeEach(() => {
			register('Etc/GMT-8');
		});

		afterEach(() => {
			unregister();
		});

		it('converts timestamp in local date', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'Local');

			// Assert:
			expect(date).toEqual(expectedDateTime.local);
		});

		it('converts timestamp in utc date', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'UTC');

			// Assert:
			expect(date).toEqual(expectedDateTime.UTC);
		});

		it('converts timestamp in default date (local) when timezone type parameter is omitted', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp);

			// Assert:
			expect(date).toEqual(expectedDateTime.local);
		});
	});

	describe('mosaicsFieldObjectBuilder should', () => {
		beforeEach(() => {
			stub(MosaicService, 'getMosaics').resolves(Promise.resolve([
				TestHelper.mockMosaicInfo('6B2E9EAF2632AEC8', 'TC46AZWUIZYZ2WVGLVEZYNZHSIFAD3AFDPUJMEA', 10, 0)
			]));

			stub(NamespaceService, 'getMosaicsNames').resolves(Promise.resolve([{
				mosaicId: '6B2E9EAF2632AEC8',
				names: []
			}]));
		});

		afterEach(restore);

		it('returns basic mosaic object', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new MosaicId(mockTestMosaicHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([
				{
					amount: '0.000001',
					id: new MosaicId(http.networkCurrency.mosaicId).id,
					mosaicAliasName: http.networkCurrency.namespaceName,
					mosaicId: http.networkCurrency.mosaicId,
					rawAmount: UInt64.fromUint(1)
				},
				{
					id: new MosaicId(mockTestMosaicHex).id,
					amount: '4',
					rawAmount: UInt64.fromUint(4),
					mosaicId: mockTestMosaicHex,
					mosaicAliasName: ['N/A']
				}
			]);
		});

		it('returns mosaics object with total amount when mosaic id is same', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new NamespaceId(http.networkCurrency.namespaceName), UInt64.fromUint(2)),
				new Mosaic(new MosaicId(mockTestMosaicHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([
				{
					id: new MosaicId(http.networkCurrency.mosaicId).id,
					amount: '0.000003',
					mosaicAliasName: http.networkCurrency.namespaceName,
					mosaicId: http.networkCurrency.mosaicId,
					rawAmount: UInt64.fromUint(3)
				},
				{
					id: new MosaicId(mockTestMosaicHex).id,
					amount: '4',
					rawAmount: UInt64.fromUint(4),
					mosaicId: mockTestMosaicHex,
					mosaicAliasName: ['N/A']
				}
			]);
		});
	});

	describe('resolveMosaicId should', () => {
		it('returns id given MosaicId', async () => {
			// Arrange:
			const mockMosaicId = new MosaicId(mockTestMosaicHex);

			// Act:
			const result = await Helper.resolveMosaicId(mockMosaicId);

			// Assert:
			expect(result).toStrictEqual(mockMosaicId.id);
		});

		it('returns network mosaic id given network NamespaceId', async () => {
			// Arrange:
			const mockNamespaceId = new NamespaceId(http.networkCurrency.namespaceName);

			// Act:
			const result = await Helper.resolveMosaicId(mockNamespaceId);

			// Assert:
			expect(result).toStrictEqual(new MosaicId(http.networkCurrency.mosaicId).id);
		});
	});

	describe('getNetworkCurrencyBalance should', () => {
		it('returns network currency balance', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new NamespaceId(http.networkCurrency.namespaceName), UInt64.fromUint(2)),
				new Mosaic(new MosaicId(mockTestMosaicHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.getNetworkCurrencyBalance(mockMosaics);

			// Assert:
			expect(result).toStrictEqual('0.000003');
		});
	});
});