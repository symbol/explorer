import Helper from '../../src/helper';
import { ReceiptExtractor } from '../../src/infrastructure';
import http from '../../src/infrastructure/http';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import {
	MosaicId,
	NamespaceId,
	NamespaceName,
	ReceiptType,
	UInt64
} from 'symbol-sdk';

describe('ReceiptExtractor', () => {

	describe('balanceChangeReceipt', () => {
		const runBasicBalanceChangeReceiptTests = async (receiptType, expectedResult) => {
			// Arrange:
			const mockStatement = TestHelper.mockBalanceChangeReceipt(10000000, http.networkCurrency.mosaicId, receiptType);

			// Act:
			const receipts = await ReceiptExtractor.balanceChangeReceipt([mockStatement]);

			// Assert:
			expect(receipts.length).toBe(1);
			expect(receipts[0].height).toBe(1000);
			expect(receipts[0].type).toBe(receiptType);
			expect(receipts[0].targetAddress).toBe(mockStatement.targetAddress.plain());
			expect(receipts[0].version).toBe(1);
			expect(receipts[0].mosaics).toEqual([{
				amount: '10.000000',
				mosaicAliasName: http.networkCurrency.namespaceName,
				mosaicId: http.networkCurrency.mosaicId,
				rawAmount: UInt64.fromUint(10000000)
			}]);
			expect(receipts[0].receiptType).toBe(expectedResult);
		};

		describe('harvestFee', () => {
			afterEach(restore);

			it('returns harvest fee receipt', async () => {
				await runBasicBalanceChangeReceiptTests(ReceiptType.Harvest_Fee, 'Harvest Fee');
			});
		});

		describe('LockHash', () => {
			afterEach(restore);

			it('returns lock hash created receipt', async () => {
				await runBasicBalanceChangeReceiptTests(ReceiptType.LockHash_Created, 'LockHash Created');
			});

			it('resolves mosaics in lock hash completed receipt', async () => {
				await runBasicBalanceChangeReceiptTests(ReceiptType.LockHash_Completed, 'LockHash Completed');
			});

			it('resolves mosaics in lock hash expired receipt', async () => {
				await runBasicBalanceChangeReceiptTests(ReceiptType.LockHash_Expired, 'LockHash Expired');
			});
		});

		describe('LockSecret', () => {
			afterEach(restore);

			const runBasicLockSecretReceiptTests = async (receiptType, expectedResult) => {
				// Arrange:
				const mockTestSecretLockMosaic = {
					idHex: '22D2D90A27738AA0',
					namespaceName: 'secret_lock_mosaic'
				};

				const mockStatement = TestHelper.mockBalanceChangeReceipt(10, mockTestSecretLockMosaic.idHex, receiptType);

				const mockMosaicInfoAndNamespace = {
					mosaicInfos: [
						TestHelper.mockMosaicInfo(mockTestSecretLockMosaic.idHex, 'TC46AZWUIZYZ2WVGLVEZYNZHSIFAD3AFDPUJMEA', 2, 0)
					],
					mosaicNames: [
						{
							names: [
								new NamespaceName(
									new NamespaceId(mockTestSecretLockMosaic.namespaceName),
									mockTestSecretLockMosaic.namespaceName
								)
							],
							mosaicId: mockTestSecretLockMosaic.idHex
						}
					],
					unresolvedMosaicsMap: {
						'22D2D90A27738AA0': '22D2D90A27738AA0'
					}
				};

				stub(Helper, 'getMosaicInfoAndNamespace').returns(Promise.resolve(mockMosaicInfoAndNamespace));

				// Act:
				const receipts = await ReceiptExtractor.balanceChangeReceipt([mockStatement]);

				// Assert:
				expect(receipts.length).toBe(1);
				expect(receipts[0].height).toBe(1000);
				expect(receipts[0].type).toBe(receiptType);
				expect(receipts[0].targetAddress).toBe(mockStatement.targetAddress.plain());
				expect(receipts[0].version).toBe(1);
				expect(receipts[0].mosaics).toEqual([{
					amount: '10',
					mosaicAliasName: mockTestSecretLockMosaic.namespaceName,
					mosaicId: mockTestSecretLockMosaic.idHex,
					rawAmount: UInt64.fromUint(10)
				}]);
				expect(receipts[0].receiptType).toBe(expectedResult);
			};

			it('resolves mosaics in lock secret created receipt', async () => {
				await runBasicLockSecretReceiptTests(ReceiptType.LockSecret_Created, 'LockSecret Created');
			});

			it('resolves mosaics in lock secret completed receipt', async () => {
				await runBasicLockSecretReceiptTests(ReceiptType.LockSecret_Completed, 'LockSecret Completed');
			});

			it('resolves mosaics in lock secret expired receipt', async () => {
				await runBasicLockSecretReceiptTests(ReceiptType.LockSecret_Expired, 'LockSecret Expired');
			});
		});
	});

	describe('balanceTransferReceipt', () => {
		const runBasicBalanceTransferReceiptTests = async (receiptType, expectedResult) => {
			// Arrange:
			const mockStatement = TestHelper.mockBalanceTransferReceipt(10000000, receiptType);

			// Act:
			const receipts = await ReceiptExtractor.balanceTransferReceipt([mockStatement]);

			// Assert:
			expect(receipts.length).toBe(1);
			expect(receipts[0].height).toBe(1000);
			expect(receipts[0].type).toBe(receiptType);
			expect(receipts[0].senderAddress).toBe(mockStatement.senderAddress.plain());
			expect(receipts[0].recipient).toBe(mockStatement.recipientAddress.plain());
			expect(receipts[0].version).toBe(1);
			expect(receipts[0].mosaics).toEqual([{
				amount: '10.000000',
				mosaicAliasName: http.networkCurrency.namespaceName,
				mosaicId: http.networkCurrency.mosaicId,
				rawAmount: UInt64.fromUint(10000000)
			}]);
			expect(receipts[0].receiptType).toBe(expectedResult);
		};

		it('returns mosaic rental fee receipt', async () => {
			await runBasicBalanceTransferReceiptTests(ReceiptType.Mosaic_Rental_Fee, 'Mosaic Rental Fee');
		});

		it('returns namespace rental fee receipt', async () => {
			await runBasicBalanceTransferReceiptTests(ReceiptType.Namespace_Rental_Fee, 'Namespace Rental Fee');
		});
	});

	describe('inflationReceipt', () => {
		it('returns inflation receipt', async () => {
			// Arrange:
			const mockStatement = TestHelper.mockInflationReceipt();

			// Act:
			const receipts = await ReceiptExtractor.inflationReceipt([mockStatement]);

			// Assert:
			expect(receipts.length).toBe(1);
			expect(receipts[0].height).toBe(1000);
			expect(receipts[0].type).toBe(ReceiptType.Inflation);
			expect(receipts[0].version).toBe(1);
			expect(receipts[0].mosaics).toEqual([{
				amount: '10.000000',
				mosaicAliasName: http.networkCurrency.namespaceName,
				mosaicId: http.networkCurrency.mosaicId,
				rawAmount: UInt64.fromUint(10000000)
			}]);
			expect(receipts[0].receiptType).toBe('Inflation');
		});
	});

	describe('artifactExpiryReceipt', () => {
		const runBasicArtifactExpiryReceiptTest = async (receiptType, artifactId, expectedResult) => {
			// Arrange:
			const mockStatement = TestHelper.mockArtifactExpiryReceipt(artifactId, receiptType);

			// Act:
			const receipts = await ReceiptExtractor.artifactExpiryReceipt([mockStatement]);

			// Assert:
			expect(receipts.length).toBe(1);
			expect(receipts[0].height).toBe(1000);
			expect(receipts[0].type).toBe(receiptType);
			expect(receipts[0].version).toBe(1);
			expect(receipts[0].receiptType).toBe(expectedResult);

			if (receipts[0].type === ReceiptType.Mosaic_Expired)
				expect(receipts[0].mosaicArtifactId).toBe(artifactId.toHex());
			else
				expect(receipts[0].namespaceArtifactId).toBe(artifactId.toHex());

		};

		it('returns mosaic expired receipt', async () => {
			await runBasicArtifactExpiryReceiptTest(ReceiptType.Mosaic_Expired, new MosaicId('22D2D90A27738AA0'), 'Mosaic Expired');
		});

		it('returns namespace expired receipt', async () => {
			await runBasicArtifactExpiryReceiptTest(ReceiptType.Namespace_Expired, new NamespaceId('hello'), 'Namespace Expired');
		});

		it('returns namespace deleted receipt', async () => {
			await runBasicArtifactExpiryReceiptTest(ReceiptType.Namespace_Deleted, new NamespaceId('hello'), 'Namespace Deleted');
		});
	});
});
