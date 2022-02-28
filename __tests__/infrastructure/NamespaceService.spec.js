import { NamespaceService, ChainService } from '../../src/infrastructure';
import TestHelper from '../TestHelper';
import { restore, stub } from 'sinon';

jest.mock('../../src/infrastructure/http', () => {
	return {
		networkType: 152,
		epochAdjustment: 1615853185,
		generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
		networkCurrency: {
			divisibility: 6,
			mosaicId: '6BED913FA20223F8',
			namespaceId: 'E74B99BA41F4AFEE',
			namespaceName: 'symbol.xym'
		},
		networkConfig: {
			TargetBlockTime: 30,
			NetworkType: 152,
			NemsisTimestamp: 1637848847,
			NamespaceGraceDuration: 2880,
			TotalChainImportance: 7842928625000000
		},
		nativeNamespaces: [
			{
				namespaceName: 'symbol'
			},
			{
				namespaceName: 'symbol.xym'
			}
		]
	};
});

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
		it('return root namespace', async () => {
			// Arrange:
			const mockNamespace = TestHelper.mockNamespace('mock_name', 864000);

			const getNamespace = stub(NamespaceService, 'getNamespace');

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
			const mockNamespace = TestHelper.mockNamespace('mock.name', 864000);

			const getNamespace = stub(NamespaceService, 'getNamespace');

			getNamespace.returns(Promise.resolve(mockNamespace));

			// Act:
			const { status, expiredInBlock, beforeEndHeight, registrationType } = await NamespaceService.getNamespaceInfo('mock.name');

			// Assert:
			expect(status).toEqual('ACTIVE');
			expect(expiredInBlock).toEqual('947420 ≈ in a year');
			expect(beforeEndHeight).toEqual('950400 ( 2880 blocks of grace period )');
			expect(registrationType).toEqual('subNamespace');
		});

		it('return native root namespace', async () => {
			// Arrange:
			const mockNamespace = TestHelper.mockNamespace('symbol', 0);

			const getNamespace = stub(NamespaceService, 'getNamespace');

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
		});
	});
});