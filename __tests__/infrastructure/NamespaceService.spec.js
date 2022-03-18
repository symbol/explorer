import { NamespaceService, ChainService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';

describe('Namespace Service', () => {
	let getChainInfo = {};

	beforeEach(() => {
		getChainInfo = stub(ChainService, 'getChainInfo');
		getChainInfo.returns(Promise.resolve({
			height: 100
		}));
	});

	afterEach(restore);

	describe('getNamespaceInfo should', () => {
		let getNamespace = {};
		beforeEach(() => {
			getNamespace = stub(NamespaceService, 'getNamespace');
		});

		it('return root namespace', async () => {
			// Arrange:
			const mockNamespace = TestHelper.mockNamespace('mock_name', 864000);

			getNamespace.returns(Promise.resolve(mockNamespace));

			// Act:
			const { status, expiredInBlock, beforeEndHeight, registrationType } = await NamespaceService.getNamespaceInfo('mock_name');

			// Assert:
			expect(status).toEqual('ACTIVE');
			expect(expiredInBlock).toEqual('947420 ≈ in a year');
			expect(beforeEndHeight).toEqual('950400 ( 2880 blocks of grace period )');
			expect(registrationType).toEqual('rootNamespace');

		});

		it('return sub namespace', async () => {
			// Arrange:
			const mockNamespace = TestHelper.mockNamespace('root.sub', 864000);

			getNamespace.returns(Promise.resolve(mockNamespace));

			// Act:
			const { registrationType } = await NamespaceService.getNamespaceInfo('root.sub');

			// Assert:
			expect(registrationType).toEqual('subNamespace');
		});

		it('return native root namespace', async () => {
			// Arrange:
			const mockNamespace = TestHelper.mockNamespace('symbol', 0);

			getNamespace.returns(Promise.resolve(mockNamespace));

			// Act:
			const { status, expiredInBlock } = await NamespaceService.getNamespaceInfo('symbol');

			// Assert:
			expect(status).toEqual('ACTIVE');
			expect(expiredInBlock).toEqual('INFINITY');
		});
	});

	describe('getNamespaceList should', () => {
		it('return namespaces', async () => {
			// Arrange:
			const pageInfo = {
				pageNumber: 1,
				pageSize: 10
			};

			const mockSearchNamespaces = {
				...pageInfo,
				data: [
					TestHelper.mockNamespace('namespace', 864000),
					TestHelper.mockNamespace('namespace.sub', 864)
				]
			};

			const searchNamespaces = stub(NamespaceService, 'searchNamespaces');

			searchNamespaces.returns(Promise.resolve(mockSearchNamespaces));

			getChainInfo.returns(Promise.resolve({
				height: 96400
			}));

			// Act:
			const namespaceList = await NamespaceService.getNamespaceList(pageInfo, {});

			// Assert:
			const validNamespace = namespaceList.data[0];
			const expiredNamespace = namespaceList.data[1];

			expect(validNamespace.isExpired).toEqual(false);
			expect(validNamespace.approximateExpired).not.toBeUndefined();
			expect(validNamespace.registrationType).toEqual('rootNamespace');

			expect(expiredNamespace.isExpired).toEqual(true);
			expect(expiredNamespace.approximateExpired).not.toBeUndefined();
			expect(expiredNamespace.registrationType).toEqual('subNamespace');

			expect(namespaceList.pageNumber).toEqual(pageInfo.pageNumber);
			expect(namespaceList.pageSize).toEqual(pageInfo.pageSize);
			expect(namespaceList.data).toHaveLength(2);
		});
	});
});