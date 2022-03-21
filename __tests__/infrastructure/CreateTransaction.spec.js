import Helper from '../../src/helper';
import { CreateTransaction, NamespaceService } from '../../src/infrastructure';
import { stub } from 'sinon';
import {
	NetworkType,
	Account,
	NamespaceId,
	UInt64,
	MosaicId,
	Convert
} from 'symbol-sdk';

/* Mock metadata transaction dto */
const mockTransactionMetadataDTO = {
	type: 16708,
	network: 152,
	version: 1,
	maxFee: '43568',
	deadline: '8324113451',
	signature: 'DFF9EAE5F5CC7AD610F979CC23111FED3109D2C357BA1CD7648ABAE8F96DA0E934294CF898868B74D0B87BAE6E37FAD3BFBDA34FE90A1DA5F421D78F78B8F108',
	signerPublicKey: '6A0BB107BB60EFC93125936BE35B7491B59D2A8F73B7B77CF391A95E720A9CE5',
	transactionInfo: {
		height: 201145,
		aggregateHash: '8DC8BDFED772B7F0094ADFBDB0593E51B1C67FB80796C84FD4C3AF3F50E57994',
		aggregateId: '621E7F1D051921634349F222'
	},
	scopedMetadataKey: UInt64.fromHex('B3E6950880062C6D'),
	valueSizeDelta: 20,
	valueSize: 23
};

describe('CreateTransaction should', () => {
	const randomAddress = Account.generateNewAccount(NetworkType.TEST_NET).address;
	const metadataValue = Convert.hexToUint8('00000020E6B189E5AD973B2070696E79696E3A2068C3A0');

	it('return accountMetadata', async () => {
		// Arrange:
		const mockAccountMetadata = {
			...mockTransactionMetadataDTO,
			value: metadataValue,
			targetAddress: randomAddress
		};

		// Act:
		const accountMetadataObject = await CreateTransaction.accountMetadata(mockAccountMetadata);

		// Assert:
		expect(accountMetadataObject.transactionBody).toEqual({
			transactionType: mockAccountMetadata.type,
			scopedMetadataKey: mockAccountMetadata.scopedMetadataKey.toHex(),
			targetAddress: randomAddress.plain(),
			metadataValue: '00000020E6B189E5AD973B2070696E79696E3A2068C3A0 (Text: \x00\x00\x00 汉字; pinyin: hà)',
			valueSizeDelta: mockAccountMetadata.valueSizeDelta
		});
	});

	it('return mosaicMetadata', async () => {
		// Arrange:
		const mockMosaicMetadata = {
			...mockTransactionMetadataDTO,
			value: metadataValue,
			targetAddress: randomAddress,
			targetMosaicId: new MosaicId('7F2D26E89342D398')
		};

		const getMosaicAliasNamesStub = stub(Helper, 'getMosaicAliasNames');
		getMosaicAliasNamesStub.returns(Promise.resolve(['N/A']));

		// Act:
		const mosaicMetadataObject = await CreateTransaction.mosaicMetadata(mockMosaicMetadata);

		// Assert:
		expect(mosaicMetadataObject.transactionBody).toEqual({
			transactionType: mockMosaicMetadata.type,
			scopedMetadataKey: mockMosaicMetadata.scopedMetadataKey.toHex(),
			targetAddress: randomAddress.plain(),
			metadataValue: '00000020E6B189E5AD973B2070696E79696E3A2068C3A0 (Text: \x00\x00\x00 汉字; pinyin: hà)',
			valueSizeDelta: mockMosaicMetadata.valueSizeDelta,
			targetMosaicId: mockMosaicMetadata.targetMosaicId.toHex(),
			targetMosaicAliasNames: ['N/A']
		});
	});

	it('return namespaceMetadata', async () => {
		// Arrange:
		const namespace = {
			namespaceId: new NamespaceId('mock-namespace'),
			name: 'mock-namespace',
			parentId: 'N/A'
		};

		const mockNamespaceMetadata = {
			...mockTransactionMetadataDTO,
			value: metadataValue,
			targetAddress: randomAddress,
			targetNamespaceId: namespace.namespaceId
		};

		const getNamespacesNamesStub = stub(NamespaceService, 'getNamespacesNames');
		getNamespacesNamesStub.returns(Promise.resolve([namespace]));

		// Act:
		const namespaceMetadataObject = await CreateTransaction.namespaceMetadata(mockNamespaceMetadata);

		// Assert:
		expect(namespaceMetadataObject.transactionBody).toEqual({
			transactionType: mockNamespaceMetadata.type,
			scopedMetadataKey: mockNamespaceMetadata.scopedMetadataKey.toHex(),
			targetAddress: randomAddress.plain(),
			metadataValue: '00000020E6B189E5AD973B2070696E79696E3A2068C3A0 (Text: \x00\x00\x00 汉字; pinyin: hà)',
			valueSizeDelta: mockNamespaceMetadata.valueSizeDelta,
			targetNamespaceId: mockNamespaceMetadata.targetNamespaceId.toHex(),
			namespaceName: [namespace]
		});
	});
});