import MessageField from '../../../src/components/fields/MessageField.vue';
import UI from '../../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const setupStoreMount = value => {
	const uiModule = {
		namespaced: true,
		getters: {
			getNameByKey: UI.getters.getNameByKey
		}
	};

	const store = new Vuex.Store({
		modules: {
			ui: uiModule
		}
	});

	return shallowMount(MessageField, {
		store,
		localVue,
		propsData: {
			value
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MessageField component', () => {
	it('renders props data', ()=> {
		// Arrange + Act:
		const wrapper = setupStoreMount({
			type: 0,
			payload: 'Hello, World!'
		});

		// Assert:
		expect(wrapper.vm.message).toMatch('Hello, World!');
	});

	describe('Button convert message format', () => {
		it('renders button when plain message payload is hex value', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount({
				type: 0,
				payload: '48656C6F2066726F6D2073796D626F6C20736E6170'
			});

			// Assert:
			expect(wrapper.find('.viewOptions').exists()).toBe(true);
		});

		it('convert hex message to utf-8 format when click on the button', () => {
			// Arrange:
			const wrapper = setupStoreMount({
				type: 0,
				payload: '48656C6F2066726F6D2073796D626F6C20736E6170'
			});

			// Act:
			wrapper.find('.viewOptions').trigger('click');

			// Assert:
			expect(wrapper.vm.message).toMatch('Helo from symbol snap');
		});

		it('convert utf-8 message to hex format when click on the button', () => {
			// Arrange:
			const wrapper = setupStoreMount({
				type: 0,
				payload: '48656C6F2066726F6D2073796D626F6C20736E6170'
			});

			// first click to convert hex to utf-8
			wrapper.find('.viewOptions').trigger('click');

			// Act:
			// second click to convert utf-8 to hex
			wrapper.find('.viewOptions').trigger('click');

			// Assert:
			expect(wrapper.vm.message).toMatch('48656C6F2066726F6D2073796D626F6C20736E6170');
		});

		const assertConvertFormatButtonNotRender = value => {
			// Arrange + Act:
			const wrapper = setupStoreMount(value);

			// Assert:
			expect(wrapper.find('.viewOptions').exists()).toBe(false);
		};

		it('does not render convert message button when plain message payload is non hex value', () => {
			assertConvertFormatButtonNotRender({
				type: 0,
				payload: 'Hello, World!'
			});
		});

		it('does not render convert message format button if encrypted message', () => {
			assertConvertFormatButtonNotRender({
				type: 1,
				payload: '48656C6F2066726F6D2073796D626F6C20736E6170'
			});
		});

		it('does not render convert message button when plain message payload is empty', () => {
			assertConvertFormatButtonNotRender({
				type: 0,
				payload: ''
			});
		});
	});
});
