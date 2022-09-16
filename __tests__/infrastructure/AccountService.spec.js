import { AccountService, ChainService, NamespaceService, NodeService, LockService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';
import { Mosaic, UInt64, MosaicId, Account, NetworkType, NamespaceName, NamespaceId } from 'symbol-sdk';
import helper from '../../src/helper';

describe('Account Service', () => {
	describe('getAccountInfo', () => {

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
			const mockPrivateKey = 'C074C68DFA5E234D801E5391757CC952B6478FCF15A2E2ED6E08EE52B4015001';
			const account = Account.createFromPrivateKey(mockPrivateKey, NetworkType.TEST_NET);
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
					name: 'alias'
				}]
			}];

			getAccount.returns(Promise.resolve(mockAccountInfo));

			getChainInfo.returns(Promise.resolve(mockChainInfo));

			getAccountsNames.returns(Promise.resolve(mockAccountAlias));

			// Act:
			const accountInfo = await AccountService.getAccountInfo(account.address.plain());

			// Assert:
			expect(accountInfo.address).toEqual(account.address.plain());
			expect(accountInfo.accountAliasNames).toEqual(['alias']);
			expect(accountInfo.accountLabel).toEqual('Mock Exchange');

			const exceptedVotingInfo = [{
				...mockAccountInfo.supplementalPublicKeys.voting[1],
				epochStatus: 'Current'
			}, {
				...mockAccountInfo.supplementalPublicKeys.voting[2],
				epochStatus: 'Future'
			}, {
				...mockAccountInfo.supplementalPublicKeys.voting[0],
				epochStatus: 'Expired'
			}];

			accountInfo.votingList.forEach((voting, index) => {
				expect(voting.epochInfo.epochStart).toEqual(exceptedVotingInfo[index].startEpoch);
				expect(voting.epochInfo.epochEnd).toEqual(exceptedVotingInfo[index].endEpoch);
				expect(voting.epochInfo.epochStatus).toEqual(exceptedVotingInfo[index].epochStatus);
				expect(voting.publicKey).toEqual(exceptedVotingInfo[index].publicKey);
			});
		});
	});

	describe('getAccountList', () => {
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
				expect(account).toHaveProperty('accountLabel');
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

	describe('getAccountNamespaceList', () => {
		const pageInfo = {
			pageNumber: 1,
			pageSize: 10
		};
		let searchNamespaces = {};
		let getChainInfo = {};

		beforeEach(() => {
			searchNamespaces = stub(NamespaceService, 'searchNamespaces');
			getChainInfo = stub(ChainService, 'getChainInfo');

			getChainInfo.returns(Promise.resolve({
				height: 1000
			}));
		});

		afterEach(restore);

		const runBasicNamespaceExpirationTests = async (namespaces, endHeight, exceptResult) => {
			// Arrange:
			const mockSearchAccountNamespaces = {
				...pageInfo,
				data: namespaces.map(namespace => {
					return {
						...TestHelper.mockNamespace(namespace, endHeight),
					};
				})
			};

			searchNamespaces.returns(Promise.resolve(mockSearchAccountNamespaces));

			// Act:
			const namespaceList = await AccountService.getAccountNamespaceList(pageInfo, {}, 'TBQ3SOJJXFO37KTGVXK7YFJYMATGJVISV2UP56I');

			// Assert:
			expect(namespaceList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(namespaceList.pageSize).toEqual(pageInfo.pageSize);
			expect(namespaceList.data).toHaveLength(2);
			expect(namespaceList.data[0].namespaceName).toBe(namespaces[0]);
			expect(namespaceList.data[0].registrationType).toBe('subNamespace');
			expect(namespaceList.data[1].namespaceName).toBe(namespaces[1]);
			expect(namespaceList.data[1].registrationType).toBe('rootNamespace');
			namespaceList.data.forEach(namespace => {
				expect(namespace.expirationDuration).toBe(exceptResult);
				expect(namespace.active).toBe('ACTIVE');
			});
		}

		it('returns namespace expiration in infinity when native namespace', async () => {
			runBasicNamespaceExpirationTests(['symbol.xym', 'symbol'], 0, 'INFINITY');
		})

		it('returns namespace expiration in date when non native namespace', async () => {
			runBasicNamespaceExpirationTests(['hello.world', 'hello'], 1000, 'in a month');
		})
	})

	describe('getAccountHashLockList', () => {
		it('returns Unused and Used hash lock transaction list ', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const mockSearchHashLocks = {
				...pageInfo,
				data: [
					TestHelper.createFormattedHashLockTransaction('Unused'),
					TestHelper.createFormattedHashLockTransaction('Used'),
				]
			};

			stub(LockService, 'searchHashLocks').returns(Promise.resolve(mockSearchHashLocks));

			// Act:
			const hashLockList = await AccountService.getAccountHashLockList(pageInfo, mockSearchHashLocks.data[0].ownerAddress);

			// Assert:
			expect(hashLockList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(hashLockList.pageSize).toEqual(pageInfo.pageSize);
			expect(hashLockList.data).toHaveLength(2);
			expect(hashLockList.data[0].status).toBe('Unused');
			expect(hashLockList.data[1].status).toBe('Used');

			hashLockList.data.forEach((hashLock, index) => {
				expect(hashLock.mosaics).toEqual([{
					amount: '10.000000',
					mosaicAliasName: 'symbol.xym',
					mosaicId: "6BED913FA20223F8",
					rawAmount: UInt64.fromUint(10000000)
				}]);
				expect(hashLock.endHeight).toBe(10);
				expect(hashLock.hash).toBe(mockSearchHashLocks.data[index].hash);
				expect(hashLock.ownerAddress).toBe(mockSearchHashLocks.data[index].ownerAddress);
			});
		})
	})

	describe('getAccountSecretLockList', () => {
		it('resolves mosaics in secret lock transaction list', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const mockTestSecretLockMosaic = {
				idHex: '22D2D90A27738AA0',
				namespaceName: 'secret_lock_mosaic'
			};

			const mockSearchSecretLocks = {
				...pageInfo,
				data: [
					TestHelper.createFormattedSecretLockTransaction(mockTestSecretLockMosaic.idHex, 30, 'Unused'),
					TestHelper.createFormattedSecretLockTransaction(mockTestSecretLockMosaic.idHex, 10, 'Used'),
				]
			};

			const mockMosaicInfoAndNamespace = {
				mosaicInfos: [
					TestHelper.mockMosaicInfo(mockTestSecretLockMosaic.idHex, 'TC46AZWUIZYZ2WVGLVEZYNZHSIFAD3AFDPUJMEA', 2, 0)
				],
				mosaicNames: [
					{
						names: [new NamespaceName(new NamespaceId(mockTestSecretLockMosaic.namespaceName), mockTestSecretLockMosaic.namespaceName)],
						mosaicId: mockTestSecretLockMosaic.idHex
					}
				],
				unresolvedMosaicsMap: {
					"22D2D90A27738AA0": '22D2D90A27738AA0'
				}
			}

			stub(LockService, 'searchSecretLocks').returns(Promise.resolve(mockSearchSecretLocks));
			stub(helper, 'getMosaicInfoAndNamespace').returns(Promise.resolve(mockMosaicInfoAndNamespace));

			// Act:
			const secretLockList = await AccountService.getAccountSecretLockList(pageInfo, mockSearchSecretLocks.data[0].ownerAddress);

			// Assert:
			expect(secretLockList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(secretLockList.pageSize).toEqual(pageInfo.pageSize);
			expect(secretLockList.data).toHaveLength(2);

			const unusedData = secretLockList.data[0];
			const usedData = secretLockList.data[1];

			expect(unusedData.status).toBe('Unused');
			expect(unusedData.mosaics).toEqual([{
				amount: '30',
				mosaicAliasName: mockTestSecretLockMosaic.namespaceName,
				mosaicId: mockTestSecretLockMosaic.idHex,
				rawAmount: UInt64.fromUint(30)
			}]);

			expect(usedData.status).toBe('Used');
			expect(usedData.mosaics).toEqual([{
				amount: '10',
				mosaicAliasName: mockTestSecretLockMosaic.namespaceName,
				mosaicId: mockTestSecretLockMosaic.idHex,
				rawAmount: UInt64.fromUint(10)
			}]);

			secretLockList.data.forEach(secretLock => {
				// Assert below are constants from createFormattedSecretLockTransaction
				expect(secretLock.endHeight).toBe(10);
				expect(secretLock.secret).toBe('112233445566');
				expect(secretLock.hashAlgorithm).toBe('Sha3 256');
			});
		})
	})
});
