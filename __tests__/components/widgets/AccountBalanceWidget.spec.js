import AccountBalanceWidget from '../../../src/components/widgets/AccountBalanceWidget.vue';
import { i18n } from '../../../src/config';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

const setupStoreMount = mosaic => {
	const accountModule = {
		namespaced: true,
		getters: {
			OwnedMosaic:() => ({
				loading: false,
				error: false
			}),
			balanceWidget: () => ({
				address: 'TDS44G6KUHO7MODUB6E6WVJOK277QY65XCBJX5Y',
				mosaic,
				alias: ['N/A']
			})
		}
	};

	const uiModule = {
		namespaced: true,
		getters: {
			getNameByKey: state => key => i18n.getName(key)
		}
	};

	const store = new Vuex.Store({
		modules: {
			account: accountModule,
			ui:uiModule
		}
	});

	const propsData = {
		managerGetter: 'account/OwnedMosaic',
		dataGetter: 'account/balanceWidget',
		title: 'accountBalanceTitle'
	};

	return mount(AccountBalanceWidget, {
		store,
		localVue,
		propsData,
		stubs: {
			'b-card': true
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Create AccountBalanceWidget', () => {
	describe('computed', () => {
		it('renders loading and error status', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount();

			// Assert:
			expect(wrapper.vm.loading).toBe(false);
			expect(wrapper.vm.error).toBe(false);
		});

		it('renders address', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount();

			// Assert:
			expect(wrapper.vm.address).toBe('TDS44G6KUHO7MODUB6E6WVJOK277QY65XCBJX5Y');
		});

		it('renders mosaicName', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount();

			// Assert:
			expect(wrapper.vm.mosaicName).toBe('xym');
		});

		it('renders xym amount', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount({
				amount: '1,000.000000',
				mosaicAliasNames: ['symbol.xym'],
				mosaicId: '6BED913FA20223F8'
			});

			// Assert:
			expect(wrapper.vm.balance).toBe('1,000.000000');
		});

		it('renders 0 xym if mosaic is not native currency', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount({
				amount: '1,000.000000',
				mosaicAliasNames: ['cat.coin'],
				mosaicId: 'FFFFFFFFFFFFFFFF'
			});

			// Assert:
			expect(wrapper.vm.balance).toBe('0');
		});

		it('renders 0 XYM amount when mosaic is empty', () => {
			// Arrange + Act:
			const wrapper = setupStoreMount();

			// Assert:
			expect(wrapper.vm.balance).toBe('0');
		});
	});
});
