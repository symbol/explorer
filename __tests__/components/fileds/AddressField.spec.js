import CopyButton from '../../../src/components/controls/CopyButton.vue';
import AddressField from '../../../src/components/fields/AddressField.vue';
import { keyRedirects } from '../../../src/config';
import UI from '../../../src/store/ui';
import { RouterLinkStub, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const setupStoreMount = () => {
	const uiModule = {
		namespaced: true,
		state: {
			keyPages: keyRedirects
		},
		getters: {
			getPageHref: UI.getters.getPageHref
		}
	};

	const store = new Vuex.Store({
		modules: {
			ui:uiModule
		}
	});

	const propsData = {
		itemKey: 'accounts',
		value: 'NAW7L44MVKCVBM6IGEBXLF2K7JYKEP6R5XMCEZA'
	};

	return shallowMount(AddressField, {
		store,
		localVue,
		propsData,
		stubs: {
			RouterLink: RouterLinkStub
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AddressField component', () => {
	// Arrange + Act:
	const wrapper = setupStoreMount();

	it('processes props data', ()=> {
		// Assert:
		expect(wrapper.vm.itemKey).toMatch('accounts');
		expect(wrapper.vm.value).toMatch('NAW7L44MVKCVBM6IGEBXLF2K7JYKEP6R5XMCEZA');
	});

	it('contains address href', () => {
		// Assert:
		expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/accounts/NAW7L44MVKCVBM6IGEBXLF2K7JYKEP6R5XMCEZA');
	});

	it('contains copy button', () => {
		// Assert:
		expect(wrapper.findComponent(CopyButton).exists()).toBe(true);
	});
});
