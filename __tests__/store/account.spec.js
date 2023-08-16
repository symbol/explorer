import account from '../../src/store/account';

describe('store/account', () => {
	describe('balanceWidget getter', () => {
		const runBasicAddressTests = (currentAccountAddress, expectedAddress) => {
			// Arrange:
			const state = {
				currentAccountAddress
			};

			const getters = {
				OwnedMosaic: {
					data: []
				},
				info: {}
			};

			// Act:
			const result = account.getters.balanceWidget(state, getters);

			// Assert:
			expect(result).toEqual({
				address: expectedAddress,
				mosaic: undefined,
				alias: undefined
			});

		};

		it('returns plain address given current account in hyphens', () => {
			runBasicAddressTests('TCWXK7-ZZW7WG-EKSJ5A-OADFEX-MWIZOM-KFBCLA-LPY', 'TCWXK7ZZW7WGEKSJ5AOADFEXMWIZOMKFBCLALPY');
		});

		it('returns empty address if no current account', () => {
			runBasicAddressTests(undefined, '');
		});
	});
});
