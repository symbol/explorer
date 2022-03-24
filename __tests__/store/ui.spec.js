import Helper from '../../src/helper';
import { AccountService, MosaicService, NamespaceService } from '../../src/infrastructure';
import ui from '../../src/store/ui';
import { stub, restore } from 'sinon';

describe('store/ui', () => {
	describe('action search should', () => {
		let dispatch;
		let rootGetters;

		beforeEach(() => {
			dispatch = jest.fn();
			rootGetters = {};
		});

		afterEach(restore);

		it('return block page with height', async () => {
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

		it('return account page with public key', async () => {
			// Arrange:
			const publicKey = 'DC20B243B63246C9E75E4FB5ED236513A005454393E93C8A4CE6EDEE323C2DDB';

			const getAccountInfoStub = stub(AccountService, 'getAccountInfo');
			getAccountInfoStub.returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, publicKey);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'account',
				param: publicKey
			});
		});

		it('return account page with address', async () => {
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

		it('return transaction page with hash', async () => {
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

		it('return mosaic page with mosaic Id', async () => {
			// Arrange:
			const mosaicId = '3A8416DB2D53B6C8';

			const getMosaicInfoStub = stub(MosaicService, 'getMosaicInfo');
			getMosaicInfoStub.returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, mosaicId);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'mosaic',
				param: mosaicId
			});
		});

		it('return namespace page with namespace name', async () => {
			// Arrange:
			const namespaceName = 'symbol.xym';

			const getNamespaceInfoStub = stub(NamespaceService, 'getNamespaceInfo');
			getNamespaceInfoStub.returns(Promise.resolve({}));

			// Act:
			await ui.actions.search({ dispatch, rootGetters }, namespaceName);

			// Assert:
			expect(dispatch).toHaveBeenCalledTimes(1);
			expect(dispatch).toHaveBeenNthCalledWith(1, 'openPage', {
				pageName: 'namespace',
				param: namespaceName
			});
		});

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
	});

});
