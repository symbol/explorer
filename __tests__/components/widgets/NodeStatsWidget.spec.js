import NodeStatsWidget from '../../../src/components/widgets/NodeStatsWidget.vue';
import { i18n } from '../../../src/config';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

const setupStoreMount = stats => {
	const nodeModule = {
		namespaced: true,
		getters: {
			nodeStats:() => stats
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
			node: nodeModule,
			ui:uiModule
		}
	});

	const propsData = {
		dataGetter: 'node/nodeStats'
	};

	return mount(NodeStatsWidget, {
		store,
		localVue,
		propsData,
		stubs: {
			'b-card': true,
			'b-container': true,
			'b-row': true,
			'b-col': true,
			'b-button': true,
			'router-link': true
		}
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('NodeStatsWidget', () => {
	describe('nodeRoles', () => {
		const assertNodeStatCounts = (stats, expected) => {
			// Arrange + Act:
			const wrapper = setupStoreMount(stats);

			// Assert:
			expect(wrapper.vm.nodeRoles).toEqual(expected);
		};

		const generateNodeStats = stats => {
			return [
				{
					name: 'Total count',
					count: stats.reduce((acc, val) => acc + val, 0)
				},
				{
					name: 'Peer node',
					count: stats[0]
				},
				{
					name: 'Api node',
					count: stats[1]
				},
				{
					name: 'Peer Api node',
					count: stats[2]
				},
				{
					name: 'Voting node',
					count: stats[3]
				},
				{
					name: 'Peer Voting node',
					count: stats[4]
				},
				{
					name: 'Api Voting node',
					count: stats[5]
				},
				{
					name: 'Peer Api Voting node',
					count: stats[6]
				}
			];
		};

		it('returns node types stats when data is present', () => {
			assertNodeStatCounts(
				{
					1: 5,
					2: 5,
					3: 5,
					4: 5,
					5: 0,
					6: 0,
					7: 5
				},
				generateNodeStats([5, 5, 5, 5, 0, 0, 5])
			);
		});

		it('returns node types stats with 0 count when no data is present', () => {
			assertNodeStatCounts(
				{},
				generateNodeStats([0, 0, 0, 0, 0, 0, 0])
			);
		});

		it('returns empty when data is undefined', () => assertNodeStatCounts(undefined, []));
	});
});
