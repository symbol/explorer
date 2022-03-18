import { TransactionService, BlockService} from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';

describe('Transaction Service', () => {
	let getBlockInfo = {};

	beforeEach(() => {
		getBlockInfo = stub(BlockService, 'getBlockInfo');
	});

	afterEach(restore);

	describe('getTransactionInfo should', () => {
		it('return transfer transaction', async () => {
			// Arrange:
			const mockTransactionStatus = {
				message: 'confirmed',
				detail: {
					code: 'Success'
				}
			};

			const mockTransactionEffectiveFee = '0.019536';

			const mockBlockInfo = {
				height: 198327,
				timestamp: '1646063763'
			};

			const mockTransferTransaction = TestHelper.mockTransaction(mockBlockInfo.height);

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

			const getTransactionEffectiveFee = stub(TransactionService, 'getTransactionEffectiveFee');
			getTransactionEffectiveFee.returns(Promise.resolve(mockTransactionEffectiveFee));

			getBlockInfo.returns(Promise.resolve(mockBlockInfo));

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

	describe('getTransactionList should', () => {
		it('return transactions', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const mockBlockInfo = {
				height: 198327,
				timestamp: '1646063763'
			};

			const mockSearchTransactions = {
				...pageInfo,
				data: [
					TestHelper.mockTransaction(mockBlockInfo.height)
				]
			};

			const searchTransactions = stub(TransactionService, 'searchTransactions');
			searchTransactions.returns(Promise.resolve(mockSearchTransactions));

			getBlockInfo.returns(Promise.resolve(mockBlockInfo));

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
});