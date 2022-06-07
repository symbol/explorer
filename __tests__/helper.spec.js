import Helper from '../src/helper';
import { register, unregister } from 'timezone-mock';

describe('Helper', () => {
	describe('hslToRgb should', () => {
		it('return rgb', () => {
			// Arrange:
			const hue = 0.77;
			const saturation = 0.9;
			const lightness = 0.8;

			//Act:
			const rgb = Helper.hslToRgb(hue, saturation, lightness);

			//Assert:
			expect(rgb).toEqual({R: 215, G: 158, B: 250});
		});
	});

	describe('convertTimestampToDate', () => {
		// Arrange:
		const networkTimestamp = 1615853185;

		const expectedDateTime = {
			local: '2021-03-16 08:06:25',
			UTC: '2021-03-16 00:06:25'
		};

		beforeEach(() => {
			register('Etc/GMT-8');
		});

		afterEach(() => {
			unregister();
		});

		it('converts timestamp in local date', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'Local');

			// Assert:
			expect(date).toEqual(expectedDateTime.local);
		});

		it('converts timestamp in utc date', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'UTC');

			// Assert:
			expect(date).toEqual(expectedDateTime.UTC);
		});

		it('converts timestamp in default date (local) when timezone type parameter is omitted', () => {
			// Act:
			const date = Helper.convertTimestampToDate(networkTimestamp);

			// Assert:
			expect(date).toEqual(expectedDateTime.local);
		});
	});
});
