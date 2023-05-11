import CopyButton from '../../../src/components/controls/CopyButton.vue';
import helper from '../../../src/helper';
import UI from '../../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { restore, stub } from 'sinon';
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
		successMessage: 'addressHasBeenCopied'
	};

	return shallowMount(CopyButton, {
		store,
		localVue,
		propsData,
		mocks: {
			$bvToast: {
				toast: jest.fn(message => message)
			}
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CopyButton component', () => {
	let wrapper = {};

	beforeEach(() => {
		wrapper = setupStoreMount();
	});

	afterEach(restore);

	it('processes props data', () => {
		// Assert:
		expect(wrapper.vm.value).toMatch('copy text');
		expect(wrapper.vm.successMessage).toMatch('addressHasBeenCopied');
	});

	it('success to copy text', async () => {
		// Arrange:
		stub(helper, 'copyTextToClipboard').returns(Promise.resolve());

		const mockSuccessMsgMethod = jest.fn();
		wrapper.setMethods({ successMsg: mockSuccessMsgMethod });

		// Act:
		await wrapper.vm.onCopyClick();

		// Assert:
		expect(mockSuccessMsgMethod).toHaveBeenCalled();
	});

	it('fail to copy text', async () => {
		// Arrange:
		stub(helper, 'copyTextToClipboard').returns(Promise.reject(Error('error')));

		const mockErrorMsgMethod = jest.fn();
		wrapper.setMethods({ errorMsg: mockErrorMsgMethod });

		// Act:
		await wrapper.vm.onCopyClick();

		// Assert:
		expect(mockErrorMsgMethod).toHaveBeenCalled();
	});

	it('returns success toast message', () => {
		// Arrange + Act:
		wrapper.vm.successMsg();

		// Assert:
		expect(wrapper.vm.$bvToast.toast).toHaveBeenCalled();
		expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith(
			'The address was copied to the clipboard',
			{'noCloseButton': true, 'solid': true, 'variant': 'success'}
		);
	});

	it('returns error toast message', () => {
		// Arrange + Act:
		wrapper.vm.errorMsg();

		// Assert:
		expect(wrapper.vm.$bvToast.toast).toHaveBeenCalled();
		expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith(
			'Failed to copy',
			{'noCloseButton': true, 'solid': true, 'variant': 'danger'}
		);
	});
});
