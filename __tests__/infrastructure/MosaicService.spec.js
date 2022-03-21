import { MosaicService, NamespaceService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { MosaicNonce, MosaicId } from 'symbol-sdk';

describe('Mosaic Service', () => {
	let getMosaic = {};
	let getMosaicsNames = [];

	beforeEach(() => {
		getMosaic = stub(MosaicService, 'getMosaic');
		getMosaicsNames = stub(NamespaceService, 'getMosaicsNames');
	});

	afterEach(restore);

	describe('getMosaicInfo should', () => {
		// Arrange:
		const {address} = TestHelper.generateAccount(1)[0];

		it('return mosaic object', async () => {
			// Arrange:
			const mosaicId = MosaicId.createFromNonce(MosaicNonce.createRandom(), address);
			const mockMosaic = TestHelper.mockMosaicInfo(mosaicId.toHex(), address.plain(), 1, 100);
			const mockMosaicsNames = [
				TestHelper.mockMosaicName(mosaicId.toHex(), 'mosaic_alias')
			];

			getMosaic.returns(Promise.resolve(mockMosaic));

			getMosaicsNames.returns(Promise.resolve(mockMosaicsNames));

			// Act:
			const {mosaicAliasNames, expiredInBlock, ...mosaicInfo} = await MosaicService.getMosaicInfo(mosaicId.toHex());

			// Assert:
			expect(mosaicInfo).toEqual(mockMosaic);
			expect(mosaicAliasNames).toEqual(mockMosaicsNames.map(m => m.names[0].name));
			expect(expiredInBlock).toEqual(101);
		});

		it('return native network mosaic object', async () => {
			// Arrange:
			const mockNativeMosaicId = '6BED913FA20223F8';
			const mockMosaic = TestHelper.mockMosaicInfo(mockNativeMosaicId, address.plain(), 1, 0);
			const mockMosaicsNames = [
				TestHelper.mockMosaicName(mockNativeMosaicId, 'symbol.xym')
			];

			getMosaic.returns(Promise.resolve(mockMosaic));

			getMosaicsNames.returns(Promise.resolve(mockMosaicsNames));

			// Act:
			const { mosaicAliasNames, expiredInBlock, ...mosaicInfo } = await MosaicService.getMosaicInfo(mockNativeMosaicId);

			// Assert:
			expect(mosaicInfo).toEqual(mockMosaic);
			expect(mosaicAliasNames).toEqual(mockMosaicsNames.map(m => m.names[0].name));
			expect(expiredInBlock).toEqual('INFINITY');
		});
	});

	describe('getMosaicList should', () => {
		it('return mosaics', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const {address} = TestHelper.generateAccount(1)[0];

			const mockNativeMosaicId = '6BED913FA20223F8';
			const mockMosaicId = '5E62990DCAC5BE8A';

			const mockSearchMosaics = {
				...pageInfo,
				data: [
					TestHelper.mockMosaicInfo(mockNativeMosaicId, address.plain(), 1, 0),
					TestHelper.mockMosaicInfo(mockMosaicId, address.plain(), 5, 100)
				]
			};

			const searchMosaics = stub(MosaicService, 'searchMosaics');

			searchMosaics.returns(Promise.resolve(mockSearchMosaics));

			const mockMosaicsNames = [
				TestHelper.mockMosaicName(mockNativeMosaicId, 'symbol.xym'),
				TestHelper.mockMosaicName(mockMosaicId, 'mosaic_alias')
			];

			getMosaicsNames.returns(Promise.resolve(mockMosaicsNames));

			// Act:
			const mosaicList = await MosaicService.getMosaicList(pageInfo);

			// Assert:
			expect(mosaicList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(mosaicList.pageSize).toEqual(pageInfo.pageSize);
			expect(mosaicList.data).toHaveLength(2);
			mosaicList.data.forEach((mosaic, index) => {
				const {supplyMutable, transferable, restrictable, revokable} = mockSearchMosaics.data[index];

				expect(mosaic.ownerAddress).toEqual(address.plain());
				expect(mosaic.mosaicAliasNames).toEqual([mockMosaicsNames[index].names[0].name]);
				expect(mosaic.mosaicFlags).toEqual({
					supplyMutable,
					transferable,
					restrictable,
					revokable
				});
			});
		});
	});
});