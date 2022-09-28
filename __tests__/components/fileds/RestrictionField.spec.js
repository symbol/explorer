import RestrictionField from '../../../src/components/fields/RestrictionField.vue';
import UI from '../../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('RestrictionField component', () => {
	const setupStoreMount = restrictions => {
		const uiModule = {
			namespaced: true,
			getters: {
				getNameByKey: UI.getters.getNameByKey
			}
		};

		const store = new Vuex.Store({
			modules: {
				ui:uiModule
			}
		});

		const propsData = {
			value: restrictions
		};

		return shallowMount(RestrictionField, {
			store,
			localVue,
			propsData
		});
	};

	describe('mosaic address restriction', () => {
		it('renders restriction field', () => {
			// Arrange:
			const restrictions = [
				{
					restrictionKey: '12345',
					restrictionValue: '10'
				},
				{
					restrictionKey: '67890',
					restrictionValue: '15'
				}
			];

			const wrapper = setupStoreMount(restrictions);

			// Act:
			const titles = wrapper.findAll('.restriction');
			const contents = wrapper.findAll('.restriction-content');

			//Assert:
			expect(titles.length).toBe(2);
			expect(contents.length).toBe(2);

			expect(titles.at(0).attributes().title).toBe('Value: 10');
			expect(contents.at(0).text()).toBe('Key 12345 : 10');

			expect(titles.at(1).attributes().title).toBe('Value: 15');
			expect(contents.at(1).text()).toBe('Key 67890 : 15');
		});
	});

	describe('mosaic global restriction', () => {
		it('renders restriction field with different restriction type', () => {
			// Arrange:
			const restrictionTypes = ['EQ', 'GE', 'GT', 'LE', 'LT', 'NE', 'NONE'];

			const restrictions = restrictionTypes.map(type => ({
				restrictionKey: '567890',
				restrictionType: 'mosaicRestrictionType.' + type,
				restrictionValue: '10',
				referenceMosaicId: '1788BA84888894EB'
			}));

			const wrapper = setupStoreMount(restrictions);

			// Act:
			const titles = wrapper.findAll('.restriction');
			const contents = wrapper.findAll('.restriction-content');

			//Assert:
			expect(titles.length).toBe(7);
			expect(contents.length).toBe(7);

			const expectedResult = [
				'Equal',
				'Greater Than Or Equal',
				'Greater Than',
				'Less Than Or Equal',
				'Less Than',
				'Not Equal',
				'No Restriction'
			];

			expectedResult.forEach((result, index) => {
				expect(titles.at(index).attributes().title).toBe(`Restriction Type: ${result} | Value: 10`);
				expect(contents.at(index).text()).toBe(`1788BA84888894EB Key 567890 ${result} 10`);
			});
		});
	});
});
