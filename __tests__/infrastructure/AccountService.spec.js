import { AccountService, ChainService, NamespaceService, NodeService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { Mosaic, UInt64, MosaicId } from 'symbol-sdk';

describe('Account Service', () => {
	describe('getAccountInfo should', () => {

		let getAccount = {};
		let getChainInfo = {};
		let getAccountsNames = [];

		beforeEach(() => {
			getAccount = stub(AccountService, 'getAccount');
			getChainInfo = stub(ChainService, 'getChainInfo');
			getAccountsNames = stub(NamespaceService, 'getAccountsNames');
		});

		afterEach(restore);

		it('return account', async () => {
			// Arrange:
			const account = TestHelper.generateAccount(1)[0];
			const mockAccountInfo = TestHelper.mockAccountInfo(account);

			const mockChainInfo = {
				latestFinalizedBlock: {
					height: 187732,
					hash: '6E95A894530C3E55EA8801A3715C6E247BB4B76F41721D41E21110E211E0231D',
					finalizationPoint: 39,
					finalizationEpoch: 300
				}
			};

			const mockAccountAlias = [{
				address: account.address.plain(),
				names: [{
					name: 'alias',
				}]
			}];

			getAccount.returns(Promise.resolve(mockAccountInfo));

			getChainInfo.returns(Promise.resolve(mockChainInfo));

			getAccountsNames.returns(Promise.resolve(mockAccountAlias));

			// Act:
			const accountInfo = await AccountService.getAccountInfo(account.address.plain());

			// Assert:
			expect(accountInfo.address).toEqual(account.address.plain());
			expect(accountInfo.votingList[0].epochInfo.epochStatus).toEqual('Current');
			expect(accountInfo.votingList[1].epochInfo.epochStatus).toEqual('Future');
			expect(accountInfo.votingList[2].epochInfo.epochStatus).toEqual('Expired');
			expect(accountInfo.accountAliasNames).toEqual(['alias']);
		});
	});

	describe('getAccountList should', () => {
		const pageInfo = {
			pageNumber: 1,
			pageSize: 10
		};
		let searchAccounts = {};
		let getStorageInfo = {};
		let getAccountsNames = [];

		beforeEach(() => {
			searchAccounts = stub(AccountService, 'searchAccounts');
			getAccountsNames = stub(NamespaceService, 'getAccountsNames');
			getStorageInfo = stub(NodeService, 'getStorageInfo');

			getStorageInfo.returns(Promise.resolve({
				numAccounts: 100
			}));
		});

		afterEach(restore);

		/**
		 * setup mock account list.
		 * @param {array} mosaics mosaic list.
		 * @param {boolean} isAccountAlias true to set account alias.
		 */
		const setupMockAccounts = (mosaics = [], isAccountAlias = false) => {
			const accounts = TestHelper.generateAccount(10);

			const mockSearchAccounts = {
				...pageInfo,
				data: accounts.map(account => {
					return {
						...TestHelper.mockAccountInfo(account),
						mosaics
					};
				})
			};

			const mockAccountsAlias = accounts.map((account, index) => {
				const name = isAccountAlias ? {
					name: `alias_${index + 1}`
				}  : {};

				return {
					address: account.address.plain(),
					names: [name]
				};
			});

			searchAccounts.returns(Promise.resolve(mockSearchAccounts));

			getAccountsNames.returns(Promise.resolve(mockAccountsAlias));
		};

		it('return accounts', async () => {
			// Arrange:
			setupMockAccounts();

			// Act:
			const accountList = await AccountService.getAccountList(pageInfo, {});

			// Assert:
			expect(accountList.totalRecords).toEqual(100);
			expect(accountList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(accountList.pageSize).toEqual(pageInfo.pageSize);
			expect(accountList.data).toHaveLength(10);
			accountList.data.forEach(account => {
				expect(account).toHaveProperty('accountAliasNames');
				expect(account).toHaveProperty('balance');
			});
		});

		it('return accounts with alias', async () => {
			// Arrange:
			setupMockAccounts([], true);

			// Act:
			const accountList = await AccountService.getAccountList(pageInfo, {});

			// Assert:
			accountList.data.forEach((account, index) => {
				expect(account.accountAliasNames).toEqual([`alias_${index + 1}`]);
			});
		});

		it('return accounts 0 balance given non network currency', async () => {
			// Arrange:
			const nonNativeCurrency = [new Mosaic(new MosaicId('19A9CFED0C0E752C'), UInt64.fromUint(1000))];

			setupMockAccounts(nonNativeCurrency);

			// Act:
			const accountList = await AccountService.getAccountList(pageInfo, {});

			// Assert:
			expect(accountList.data).toHaveLength(10);
			accountList.data.forEach(account => {
				expect(account.balance).toEqual('0.000000');
			});
		});

		it('return accounts balance given network currency', async () => {
			// Arrange:
			const nativeCurrency = [new Mosaic(new MosaicId('6BED913FA20223F8'), UInt64.fromUint(1000))];

			setupMockAccounts(nativeCurrency);

			// Act:
			const accountList = await AccountService.getAccountList(pageInfo, {});

			// Assert:
			expect(accountList.data).toHaveLength(10);
			accountList.data.forEach(account => {
				expect(account.balance).toEqual('0.001000');
			});
		});
	});
});