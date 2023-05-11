import { AccountService, MosaicService, NamespaceService } from '../../src/infrastructure';
import ui from '../../src/store/ui';
import { restore, stub } from 'sinon';

describe('store/ui', () => {
	describe('action search', () => {
		let dispatch;
		let rootGetters;

		beforeEach(() => {
			dispatch = jest.fn();
			rootGetters = {};
		});

		afterEach(restore);

		const assertSearchNamespace = async namespaceName => {
			// Arrange:
			stub(NamespaceService, 'getNamespaceInfo').returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, namespaceName);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'namespace',
				param: namespaceName
			});
		};

		it('returns block page with height', async () => {
			// Arrange:
			const height = '10';

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, height);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'block',
				param: height
			});
		});

		it('returns account page with public key', async () => {
			// Arrange:
			const publicKey = 'DC20B243B63246C9E75E4FB5ED236513A005454393E93C8A4CE6EDEE323C2DDB';

			stub(AccountService, 'getAccountInfo').returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, publicKey);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'account',
				param: publicKey
			});
		});

		it('returns account page with address', async () => {
			// Arrange:
			const address = 'TAR5OQBKR4KSVRVZ3ZBVHNLMBZ4N4Q27WFVMJDI';

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, address);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'account',
				param: address
			});
		});

		it('returns transaction page with hash', async () => {
			// Arrange:
			const hash = '706BBC8F95AF60B22CB38911A645D3BA24DC480FDBE18C197ACCFE0FDE0DC24D';

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, hash);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'transaction',
				param: hash
			});
		});

		it('returns mosaic page with mosaic Id', async () => {
			// Arrange:
			const mosaicId = '3A8416DB2D53B6C8';

			stub(MosaicService, 'getMosaicInfo').returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, mosaicId);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'mosaic',
				param: mosaicId
			});
		});

		it('returns namespace page with namespace name', async () => await assertSearchNamespace('symbol.xym'));

		it('returns namespace page with namespace name contain dash', async () => await assertSearchNamespace('symbol-'));

		it('throw error given Nem address', async () => {
			// Arrange:
			const nemAddress = 'TALICE546OTUY4YJTQCQZ4HSEP4UM5Y5KRG4JHD7';

			// Act + Assert:
			return expect(ui.actions.search({ dispatch, rootGetters }, nemAddress))
				.rejects.toThrow('errorNisAddressNotAllowed');
		});

		it('throw error given data not found', async () => {
			// Arrange:
			const randomText = 'zz';

			// Act + Assert:
			return expect(ui.actions.search({ dispatch, rootGetters }, randomText))
				.rejects.toThrow('errorNothingFound');
		});

		describe('input value contain whitespace', () => {
			const runBasicWhitespaceTests = (pageName, inputValue, expectedResult) => {
				it(`returns ${pageName} page`, async () => {
					// Arrange:
					if ('mosaic' === pageName)
						stub(MosaicService, 'getMosaicInfo').returns(Promise.resolve({}));
					else if('account' === pageName)
						stub(AccountService, 'getAccountInfo').returns(Promise.resolve({}));
					else if ('namespace' === pageName)
						stub(NamespaceService, 'getNamespaceInfo').returns(Promise.resolve({}));

					// Act:
					await ui.actions.search({ dispatch, rootGetters }, inputValue);

					// Assert:
					expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', expectedResult);
				});
			};

			// Arrange:
			const inputValues = [
				{
					pageName: 'block',
					input: ' 10 '
				},
				{
					pageName: 'account',
					input: ' DC20B243B63246C9E75E4FB5ED236513A005454393E93C8A4CE6EDEE323C2DDB '
				},
				{
					pageName: 'account',
					input: ' TAR5OQBKR4KSVRVZ3ZBVHNLMBZ4N4Q27WFVMJDI '
				},
				{
					pageName: 'transaction',
					input: ' 706BBC8F95AF60B22CB38911A645D3BA24DC480FDBE18C197ACCFE0FDE0DC24D'
				},
				{
					pageName: 'mosaic',
					input: '3A8416DB2D53B6C8 '
				},
				{
					pageName: 'namespace',
					input: 'symbol . xym '
				}
			];

			inputValues.forEach(({input, pageName}) => runBasicWhitespaceTests(pageName, input, {
				pageName,
				param: input.replace(/\s/g, '')
			}));
		});
	});
});
