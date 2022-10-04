import { MetadataService } from '../../src/infrastructure';

// Arrange:
jest.mock('../../src/infrastructure/http', () => {
	const {
		MosaicId,
		Address,
		MetadataType,
		UInt64
	} = require('symbol-sdk');

	const commonMetadataEntryProperties = {
		version: 1,
		compositeHash: '24E125C7CC30B258778B370A05F4D41104C59C899FD9C67DD0B043F7A39CD7C7',
		sourceAddress: Address.createFromRawAddress('TCG72DW2OS6GQJRTUKTYCEPVYOAB33HIM2TDRPI'),
		scopedMetadataKey: UInt64.fromHex('0000676E69746172'),
		targetAddress: Address.createFromRawAddress('TAEYC7NUBWLJDTWDQSD7PGPZ3J7BB6S6ZRWH6VY')
	};

	return {
		createRepositoryFactory: {
			createMetadataRepository: () => {
				return {
					search: () => {
						return {
							toPromise: () => {
								return {
									data: [
										{
											id: '633AF9E4464297FBEB0D3C78',
											metadataEntry: {
												...commonMetadataEntryProperties,
												metadataType: MetadataType.Mosaic,
												value: 'mosaic metadata',
												targetId: new MosaicId('3DCE9365EAF9ED2F')
											}
										},
										{
											id: '633AF986464297FBEB0D3C0C',
											metadataEntry: {
												...commonMetadataEntryProperties,
												metadataType: MetadataType.Namespace,
												value: 'namespace metadata',
												targetId: new MosaicId('88F51D7777385EA4')
											}
										},
										{
											id: '633AF6E0464297FBEB0D38AE',
											metadataEntry: {
												...commonMetadataEntryProperties,
												metadataType: MetadataType.Account,
												value: 'account metadata'
											}
										}
									],
									isLastPage: true,
									pageNumber: 1,
									pageSize: 10
								};
							}
						};
					}
				};
			}
		}
	};
});

describe('MetadataService', () => {
	describe('searchMetadatas', () => {
		it('returns pagination metadatas dto', async () => {
			// Arrange + Act:
			const { isLastPage, pageNumber, pageSize, data } = await MetadataService.searchMetadatas({});

			// Assert:
			const commonMetadataEntryDto= {
				version: 1,
				compositeHash: '24E125C7CC30B258778B370A05F4D41104C59C899FD9C67DD0B043F7A39CD7C7',
				scopedMetadataKey: '0000676E69746172',
				sourceAddress: 'TCG72DW2OS6GQJRTUKTYCEPVYOAB33HIM2TDRPI',
				targetAddress: 'TAEYC7NUBWLJDTWDQSD7PGPZ3J7BB6S6ZRWH6VY'
			};

			expect(isLastPage).toBe(true);
			expect(pageNumber).toBe(1);
			expect(pageSize).toBe(10);
			expect(data.length).toBe(3);
			expect(data).toEqual([
				{
					...commonMetadataEntryDto,
					metadataId: '633AF9E4464297FBEB0D3C78',
					metadataType: 'Mosaic',
					targetId: '3DCE9365EAF9ED2F',
					value: 'mosaic metadata'
				},
				{
					...commonMetadataEntryDto,
					metadataId: '633AF986464297FBEB0D3C0C',
					metadataType: 'Namespace',
					targetId: '88F51D7777385EA4',
					value: 'namespace metadata'
				},
				{
					...commonMetadataEntryDto,
					metadataId: '633AF6E0464297FBEB0D38AE',
					metadataType: 'Account',
					targetId: 'N/A',
					value: 'account metadata'
				}
			]);
		});
	});
});
