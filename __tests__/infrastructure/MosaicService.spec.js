import { MosaicService, NamespaceService, ReceiptService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { MosaicId, MosaicNonce } from 'symbol-sdk';

describe('Mosaic Service', () => {
	let getMosaic = {};
	let getMosaicsNames = [];
	let searchReceipts = {};
	let createReceiptTransactionStatement = [];

	beforeEach(() => {
		getMosaic = stub(MosaicService, 'getMosaic');
		getMosaicsNames = stub(NamespaceService, 'getMosaicsNames');
		searchReceipts = stub(ReceiptService, 'searchReceipts');
		createReceiptTransactionStatement = stub(ReceiptService, 'createReceiptTransactionStatement');
	});

	afterEach(restore);

	describe('getMosaicInfo', () => {
		// Arrange:
		const {address} = TestHelper.generateAccount(1)[0];

		it('returns mosaic object', async () => {
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

		it('returns native network mosaic object', async () => {
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

	describe('getMosaicList', () => {
		it('returns mosaics', async () => {
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

	describe('getMosaicArtifactExpiryReceipt', () => {
		// Arrange:
		const pageInfo = {
			pageNumber: 1,
			pageSize: 10
		};
		const {address} = TestHelper.generateAccount(1)[0];
		const mosaicId = MosaicId.createFromNonce(MosaicNonce.createRandom(), address);

		it('returns default info and skip receipt service request when mosaic duration is 0', async () => {
			// Arrange:
			const mosaicInfo = TestHelper.mockMosaicInfo(mosaicId.toHex(), address.plain(), 100, 0);

			getMosaic.returns(Promise.resolve(mosaicInfo));

			jest.spyOn(ReceiptService, 'searchReceipts');
			jest.spyOn(ReceiptService, 'createReceiptTransactionStatement');

			// Act:
			const result = await MosaicService.getMosaicArtifactExpiryReceipt(pageInfo, mosaicId.toHex());

			// Assert:
			expect(ReceiptService.searchReceipts).not.toHaveBeenCalled();
			expect(ReceiptService.createReceiptTransactionStatement).not.toHaveBeenCalled();
			expect(result).toEqual({
				data: [],
				...pageInfo,
				isLastPage: true
			});
		});

		it('returns artifact expiry receipt when duration is nonzero ', async () => {
			// Arrange:
			const mosaicInfo = TestHelper.mockMosaicInfo(mosaicId.toHex(), address.plain(), 900, 100);

			getMosaic.returns(Promise.resolve(mosaicInfo));

			searchReceipts.returns(Promise.resolve({
				data: {
					artifactExpiryStatement: {
						data: [TestHelper.mockArtifactExpiryReceipt(mosaicId.toHex(), 16717)],
						receiptTransactionStatementType: 'Artifact Expiry Receipt'
					}
				},
				...pageInfo,
				isLastPage: true
			}));

			const receiptDto = {
				artifactId: mosaicId.toHex(),
				height: 1000,
				mosaicArtifactId: mosaicId.toHex(),
				receiptType: 'Mosaic Expired',
				type: 16717,
				version: 1
			};

			createReceiptTransactionStatement.returns(Promise.resolve([receiptDto]));

			// Act:
			const result = await MosaicService.getMosaicArtifactExpiryReceipt(pageInfo, mosaicId.toHex());

			// Assert:
			expect(result).toEqual({
				data: [receiptDto],
				...pageInfo,
				isLastPage: true
			});
		});
	});
});
