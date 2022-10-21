import Constants from '../../src/config/constants';
import transaction from '../../src/store/transaction';
import { TransactionType } from 'symbol-sdk';

describe('store/transaction', () => {
	describe('action/getTransactionInfoByHash', () => {
		const runBasicFetchHashLockTests = (transactionType, transactionName) => {
			const context = {
				dispatch: jest.fn(),
				getters: {
					info: {
						setStore: jest.fn().mockReturnThis(),
						initialFetch: jest.fn()
					},
					hashLock: {
						setStore: jest.fn().mockReturnThis(),
						initialFetch: jest.fn()
					},
					transactionDetail: {
						transactionType
					}
				}
			};

			const isAggregateBonded = transactionType === TransactionType.AGGREGATE_BONDED;

			it(`${isAggregateBonded ? '' : 'skips '}fetch hash lock when transaction type is ${transactionName}`, async () => {
				// Arrange:
				const payload = {
					transactionHash: '5E699B430581BE31A175952F88876166EAEE713FB05465F7CAC6B182F25B995F'
				};

				// Act:
				await transaction.actions.getTransactionInfoByHash(context, payload);

				// Assert:
				const { info, hashLock } = context.getters;

				expect(context.dispatch).toHaveBeenNthCalledWith(1, 'uninitializeDetail');

				expect(info.setStore).toHaveBeenNthCalledWith(1, context);
				expect(hashLock.setStore).toHaveBeenNthCalledWith(1, context);

				expect(info.initialFetch).toHaveBeenCalledWith(payload.transactionHash);

				if (isAggregateBonded)
					expect(hashLock.initialFetch).toHaveBeenCalledWith(payload.transactionHash);
				else
					expect(hashLock.initialFetch).not.toHaveBeenCalled();
			});
		};

		// Arrange:
		Object.keys(Constants.TransactionType).forEach(type => {
			runBasicFetchHashLockTests(Number(type), Constants.TransactionType[type]);
		});
	});
});
