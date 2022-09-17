import { TransactionService, LockService } from '../../src/infrastructure';
import http from '../../src/infrastructure/http';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { MosaicId, UInt64 } from 'symbol-sdk';

describe('Transaction Service', () => {
	afterEach(restore);

	describe('getTransactionInfo', () => {
		it('return transfer transaction', async () => {
			// Arrange:
			const mockTransactionStatus = {
				message: 'confirmed',
				detail: {
					code: 'Success'
				}
			};

			const mockTransactionEffectiveFee = '0.001760';

			const mockBlockInfo = {
				height: 198327,
				timestamp: 1646063763
			};

			const mockTransferTransaction = TestHelper.mockTransaction(mockBlockInfo);

			const mockCreateTransactionFromSDK = {
				...mockTransferTransaction,
				deadline: '2022-02-28 17:55:31',
				maxFee: mockTransactionEffectiveFee,
				transactionType: 16724,
				transactionBody: {
					transactionType: 16724,
					message: {
						type: -1,
						payload: ''
					},
					recipient: 'TDCPHIHQPN6WKJJIUCOFISJCB4NULEZOS4NCQQQ',
					mosaics: [
						{
							amount: '5',
							mosaicId: '7F2D26E89342D398',
							mosaicAliasName: [
								'teria.revokable'
							]
						}
					]
				}
			};

			const getTransactionStatus = stub(TransactionService, 'getTransactionStatus');
			getTransactionStatus.returns(Promise.resolve(mockTransactionStatus));

			const getTransaction = stub(TransactionService, 'getTransaction');
			getTransaction.returns(Promise.resolve(mockTransferTransaction));

			const createTransactionFromSDK = stub(TransactionService, 'createTransactionFromSDK');
			createTransactionFromSDK.returns(Promise.resolve(mockCreateTransactionFromSDK));

			// Act:
			const { blockHeight,
				transactionBody,
				transactionHash,
				effectiveFee,
				timestamp,
				status,
				confirm
			} = await TransactionService.getTransactionInfo('541B506C91003C248CF09C6FB3BC94D0A26B8197B76B2827DDE3AF3A0ED3E350');

			// Assert:
			expect(blockHeight).toEqual(mockTransferTransaction.transactionInfo.height);
			expect(transactionHash).toEqual(mockTransferTransaction.transactionInfo.hash);
			expect(effectiveFee).toEqual(mockTransactionEffectiveFee);
			expect(timestamp).toEqual(mockBlockInfo.timestamp);
			expect(status).toEqual(mockTransactionStatus.detail.code);
			expect(confirm).toEqual(mockTransactionStatus.message);
			expect(transactionBody).toEqual(mockCreateTransactionFromSDK.transactionBody);
		});
	});

	describe('getTransactionList', () => {
		it('return transactions', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const mockBlockInfo = {
				height: 198327,
				timestamp: 1646063763
			};

			const mockSearchTransactions = {
				...pageInfo,
				data: [
					TestHelper.mockTransaction(mockBlockInfo)
				]
			};

			const searchTransactions = stub(TransactionService, 'searchTransactions');
			searchTransactions.returns(Promise.resolve(mockSearchTransactions));

			// Act:
			const transactionList = await TransactionService.getTransactionList(pageInfo, {});

			// Assert:
			expect(transactionList.totalRecords).toEqual(500);
			expect(transactionList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(transactionList.pageSize).toEqual(pageInfo.pageSize);
			expect(transactionList.data).toHaveLength(1);
			transactionList.data.forEach(transaction => {
				expect(transaction).toHaveProperty('transactionHash');
				expect(transaction).toHaveProperty('transactionType');
				expect(transaction).toHaveProperty('recipient');
				expect(transaction).toHaveProperty('extendGraphicValue');
			});
		});
	});

	describe('getHashLockInfo', () => {
		it('resolves mosaics in hash lock info when transaction hash provided', async () => {
			// Arrange:
			const { address } = TestHelper.generateAccount(1)[0];

			const mockHashLock = {
				amount: UInt64.fromUint(10),
				endHeight: 10,
				hash: '41A1F78E82A80A6C6A845BE49BFC3DD3E05040ED72E598E7ED1BD80A9C691E0E',
				mosaicId: new MosaicId(http.networkCurrency.mosaicId),
				ownerAddress: address.plain(),
				recordId: '631FA269464297FBEBEFE0ED',
				status: 'Unused',
				version: 1
			};

			stub(LockService, 'getHashLock').returns(Promise.resolve(mockHashLock));

			// Act:
			const hashLockInfo = await TransactionService.getHashLockInfo(mockHashLock.hash);

			// Assert:
			expect(hashLockInfo).toEqual({
				...mockHashLock,
				mosaics: [{
					amount: '0.000010',
					mosaicAliasName: 'symbol.xym',
					mosaicId: '6BED913FA20223F8',
					rawAmount: UInt64.fromUint(10)
				}]
			});
		});
	});
});
