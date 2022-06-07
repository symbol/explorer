import DateField from '../../../src/components/fields/DateField.vue';
import UI from '../../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { restore } from 'sinon';
import { register, unregister } from 'timezone-mock';
import Vuex from 'vuex';

const setupStoreMount = () => {
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
		timestamp: 1615853185,
		shouldShowTimestamp: true
	};

	return shallowMount(DateField, {
		store,
		localVue,
		propsData
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('DateField component', () => {
	// Arrange:
	const timestamp = 1615853185;
	let wrapper = {};

	beforeEach(() => {
		register('Etc/GMT-8');
		wrapper = setupStoreMount();
	});

	afterEach(() => {
		restore();
		unregister();
	});

	it('renders date and timestamp when shouldShowTimestamp is true', async () => {
		// Act:
		await wrapper.vm.showDate(timestamp);

		// Assert:
		expect(wrapper.html()).toMatch('<div class=\"date-container\">'
			+ '<span title=\"2021-03-16 08:06:25\">2021-03-16 08:06:25</span> '
			+ '<span class=\"timestamp\">Symbol Time : 1615853185</span></div>');
	});

	it('renders date only when shouldShowTimestamp is false', async () => {
		// Arrange:
		wrapper.setProps({
			timestamp: 1615853185,
			shouldShowTimestamp: false
		});

		// Act:
		await wrapper.vm.showDate(timestamp);

		// Assert:
		expect(wrapper.html()).toMatch('<div class=\"date-container\">'
			+ '<span title=\"2021-03-16 08:06:25\">2021-03-16 08:06:25</span>');
	});
});
