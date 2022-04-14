import Helper from '../src/helper';

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

	describe('convertTimestampToDate should', () => {
		// Arrange:
		const networkTimestamp = 1615853185;

		it('convert timestamp in utc date', () => {
			//Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'Local');

			//Assert:
			expect(date).toEqual("2021-03-16 08:06:25");
		});

		it('convert timestamp in utc date', () => {
			//Act:
			const date = Helper.convertTimestampToDate(networkTimestamp, 'UTC');

			//Assert:
			expect(date).toEqual("2021-03-16 00:06:25");
		});
	});
});
