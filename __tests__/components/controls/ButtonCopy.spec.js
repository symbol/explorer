import CopyButton from '../../../src/components/controls/CopyButton.vue';
import UI from '../../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
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
		value: 'copy text',
		successMessage: 'success'
	};

	return shallowMount(CopyButton, {
		store,
		localVue,
		propsData,
		mocks: {
			$bvToast: {
				toast: jest.fn()
			}
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CopyButton component', () => {
	// Arrange:
	const wrapper = setupStoreMount();

	it('processes props data', ()=> {
		// Assert:
		expect(wrapper.vm.value).toMatch('copy text');
		expect(wrapper.vm.successMessage).toMatch('success');
	});

	it('click on copy button', () =>{
		// Arrange:
		document.execCommand = jest.fn();

		// Act:
		wrapper.vm.onCopyClick();

		// Assert:
		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});
});
