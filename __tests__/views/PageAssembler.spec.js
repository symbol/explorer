import PageAssembler from '../../src/views/PageAssembler.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('views/PageAssembler', () => {
	const createWrapper = () => {
		const propsData = {
			layout: 'flex',
			schema: [{
				managerGetter: 'test/info'
			}]
		};

		return shallowMount(PageAssembler, {
			localVue,
			propsData
		});
	};
	describe('method', () => {
		describe('isItemShown', () => {
			const runBasicHideEmptyDataTests = (data, expectedResult) => {
				const action = expectedResult ? 'renders' : 'hides';
				const condition = expectedResult ? 'non empty' : 'empty';
				const dataType = Array.isArray(data) ? 'array' : 'object';

				it(`${action} item when hideEmptyData set true and data in ${dataType} is ${condition}`, () => {
					// Arrange:
					const wrapper = createWrapper();

					const schemaConfig = {
						hideEmptyData: true
					};

					jest.spyOn(wrapper.vm, 'getData').mockReturnValue(data);

					// Act:
					const result = wrapper.vm.isItemShown(schemaConfig);

					// Assert:
					expect(result).toBe(expectedResult);
				});

			};

			const runItemShownTests = (schemaConfig, getter, expectedResult) => {
				const action = expectedResult ? 'renders' : 'hides';
				const condition = expectedResult ? 'non errors' : 'errors';

				it(`${action} item when ${Object.keys(schemaConfig)[0]} is set and getters has ${condition}`, () => {
					// Arrange:
					const wrapper = createWrapper();

					jest.spyOn(wrapper.vm, 'getter').mockReturnValue(getter);

					// Act:
					const result = wrapper.vm.isItemShown(schemaConfig);

					// Assert:
					expect(result).toBe(expectedResult);
				});
			};

			runBasicHideEmptyDataTests([], false);
			runBasicHideEmptyDataTests(['1'], true);

			runBasicHideEmptyDataTests({}, false);
			runBasicHideEmptyDataTests({ test: '1'}, true);

			runItemShownTests(
				{
					hideDependOnGetter: 'test/info'
				},
				{
					error: true
				},
				false
			);

			runItemShownTests(
				{
					hideDependOnGetter: 'test/info'
				},
				{
					error: false
				},
				true
			);

			runItemShownTests(
				{
					hideOnError: true
				},
				{
					error: true
				},
				false
			);

			runItemShownTests(
				{
					hideOnError: true
				},
				{
					error: false
				},
				true
			);
		});
	});
});
