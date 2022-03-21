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
});
