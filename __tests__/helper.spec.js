import TestHelper from './TestHelper';
import Helper from '../src/helper';
import { MosaicService, NamespaceService } from '../src/infrastructure';
import http from '../src/infrastructure/http';
import { stub, restore } from 'sinon';
import { Mosaic, MosaicId, UInt64, NamespaceId, NamespaceName } from 'symbol-sdk';
import { register, unregister } from 'timezone-mock';

const mockTestMosaic = {
	idHex: '6B2E9EAF2632AEC8',
	namespaceName: 'namespace_mosaic'
};

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

	describe('mosaicsFieldObjectBuilder', () => {
		beforeEach(() => {
			stub(MosaicService, 'getMosaics').resolves(Promise.resolve([
				TestHelper.mockMosaicInfo(mockTestMosaic.idHex, 'TC46AZWUIZYZ2WVGLVEZYNZHSIFAD3AFDPUJMEA', 10, 0)
			]));

			stub(NamespaceService, 'getMosaicsNames').resolves(Promise.resolve([{
				names: [new NamespaceName(new NamespaceId(mockTestMosaic.namespaceName), mockTestMosaic.namespaceName)],
				mosaicId: mockTestMosaic.idHex
			}]));

			stub(NamespaceService, 'getLinkedMosaicId').resolves(Promise.resolve(new MosaicId(mockTestMosaic.idHex)));
		});

		afterEach(restore);

		it('returns basic mosaic object', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new MosaicId(mockTestMosaic.idHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([
				{
					amount: '0.000001',
					rawAmount: UInt64.fromUint(1),
					mosaicId: http.networkCurrency.mosaicId,
					mosaicAliasName: http.networkCurrency.namespaceName
				},
				{
					amount: '4',
					rawAmount: UInt64.fromUint(4),
					mosaicId: mockTestMosaic.idHex,
					mosaicAliasName: mockTestMosaic.namespaceName
				}
			]);
		});

		it('returns mosaic object when only network currency', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(10)),
				new Mosaic(new NamespaceId(http.networkCurrency.namespaceName), UInt64.fromUint(20))
			];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([
				{
					amount: '0.000030',
					rawAmount: UInt64.fromUint(30),
					mosaicId: http.networkCurrency.mosaicId,
					mosaicAliasName: http.networkCurrency.namespaceName
				}
			]);
		});

		it('returns mosaics object with total amount when mosaic id is same', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new NamespaceId(http.networkCurrency.namespaceName), UInt64.fromUint(2)),
				new Mosaic(new MosaicId(mockTestMosaic.idHex), UInt64.fromUint(4)),
				new Mosaic(new NamespaceId(mockTestMosaic.namespaceName), UInt64.fromUint(2))
			];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([
				{
					amount: '0.000003',
					rawAmount: UInt64.fromUint(3),
					mosaicId: http.networkCurrency.mosaicId,
					mosaicAliasName: http.networkCurrency.namespaceName
				},
				{
					amount: '6',
					rawAmount: UInt64.fromUint(6),
					mosaicId: mockTestMosaic.idHex,
					mosaicAliasName: mockTestMosaic.namespaceName
				}
			]);
		});

		it('returns empty array when mosaics does not exist', async () => {
			// Arrange:
			const mockMosaics = [];

			// Act:
			const result = await Helper.mosaicsFieldObjectBuilder(mockMosaics);

			// Assert:
			expect(result).toStrictEqual([]);
		});
	});

	describe('resolveMosaicId', () => {
		let stubGetLinkedMosaicId = {};

		beforeEach(() => {
			stubGetLinkedMosaicId = stub(NamespaceService, 'getLinkedMosaicId').resolves(Promise.resolve(new MosaicId(mockTestMosaic.idHex)));
		});

		afterEach(restore);

		it('returns id given MosaicId', async () => {
			// Arrange:
			const mockMosaicId = new MosaicId(mockTestMosaic.idHex);

			// Act:
			const result = await Helper.resolveMosaicId(mockMosaicId);

			// Assert:
			expect(result).toStrictEqual(mockMosaicId);
			expect(stubGetLinkedMosaicId.callCount).toBe(0);
		});

		it('returns network mosaic id given network NamespaceId', async () => {
			// Arrange:
			const mockNamespaceId = new NamespaceId(http.networkCurrency.namespaceName);

			// Act:
			const result = await Helper.resolveMosaicId(mockNamespaceId);

			// Assert:
			expect(result).toStrictEqual(new MosaicId(http.networkCurrency.mosaicId));
			expect(stubGetLinkedMosaicId.callCount).toBe(0);
		});

		it('returns mosaic id given NamespaceId', async () => {
			// Arrange:
			const mockNamespaceId = new NamespaceId(mockTestMosaic.namespaceName);

			// Act:
			const result = await Helper.resolveMosaicId(mockNamespaceId);

			// Assert:
			expect(result).toStrictEqual(new MosaicId(mockTestMosaic.idHex));
			expect(stubGetLinkedMosaicId.callCount).toBe(1);
		});
	});

	describe('getNetworkCurrencyBalance', () => {
		it('returns network currency balance', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(http.networkCurrency.mosaicId), UInt64.fromUint(1)),
				new Mosaic(new NamespaceId(http.networkCurrency.namespaceName), UInt64.fromUint(2)),
				new Mosaic(new MosaicId(mockTestMosaic.idHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.getNetworkCurrencyBalance(mockMosaics);

			// Assert:
			expect(result).toStrictEqual('0.000003');
		});

		it('returns unavailable when network currency does not exist', async () => {
			// Arrange:
			const mockMosaics = [
				new Mosaic(new MosaicId(mockTestMosaic.idHex), UInt64.fromUint(4))
			];

			// Act:
			const result = await Helper.getNetworkCurrencyBalance(mockMosaics);

			// Assert:
			expect(result).toStrictEqual('N/A');
		});
	});

	describe('formatMosaicAmountWithDivisibility', () => {
		it('returns balance as string', () => {
			// Arrange:
			const amount = UInt64.fromUint(10).compact();

			// Act:
			const result = Helper.formatMosaicAmountWithDivisibility(amount, 6);

			// Assert:
			expect(result).toStrictEqual('0.000010');
		});

		it('throws error if amount is not number', async () => {
			// Arrange:
			const amount = UInt64.fromUint(10);

			// Act: + Assert:
			expect(() => Helper.formatMosaicAmountWithDivisibility(amount, 0)).toThrow('amount must be a number');
		});
	});
});
