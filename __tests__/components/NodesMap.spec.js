import NodesMap from '../../src/components/NodesMap.vue';
import { keyRedirects } from '../../src/config';
import UI from '../../src/store/ui';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import leaflet from 'leaflet';
import Vuex from 'vuex';

jest.mock('../../src/styles/img/connector_blue.png', () => 'blue.png');
jest.mock('../../src/styles/img/connector_blue_light.png', () => 'blue-light.png');
jest.mock('../../src/styles/img/connector_green.png', () => 'green.png');
jest.mock('../../src/styles/img/connector_green_light.png', () => 'green-light.png');

const setupStoreMount = (role, isApiNode) => {
	const nodeModule = {
		namespaced: true
	};

	const uiModule = {
		namespaced: true,
		state: {
			keyPages: keyRedirects
		},
		getters: {
			getNameByKey: UI.getters.getNameByKey,
			getPageHref: UI.getters.getPageHref
		}
	};

	const store = new Vuex.Store({
		modules: {
			node: nodeModule,
			ui:uiModule
		}
	});

	const propsData = {
		nodes: [{
			rolesRaw: role,
			isApiNode,
			coordinates: {
				latitude: 1,
				longitude: 2
			}
		}]
	};

	return shallowMount(NodesMap, {
		store,
		localVue,
		propsData
	});
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('NodesMap', () => {
	describe('addMarkers', () => {
		const assertMarkerIcon = (role, isApiNode, expectedIcon) => {
			// Arrange:
			const wrapper = setupStoreMount(role, isApiNode);

			// Act:
			wrapper.vm.addMarkers();

			// Assert:
			expect(leaflet.marker).toHaveBeenCalledWith(
				[1, 2],
				expect.objectContaining({
					icon: expect.objectContaining({
						iconUrl: expectedIcon
					})
				})
			);
		};

		describe('peer node', () => {
			it('create marker with peer icon', () => {
				assertMarkerIcon(1, false, 'blue.png');
			});

			it('create marker with light peer icon', () => {
				assertMarkerIcon(1, true, 'blue-light.png');
			});
		});

		describe('voting node', () => {
			it('create marker with voting icon', () => {
				assertMarkerIcon(4, false, 'green.png');
				assertMarkerIcon(5, false, 'green.png');
			});

			it('create marker with light voting icon', () => {
				assertMarkerIcon(4, true, 'green-light.png');
				assertMarkerIcon(5, true, 'green-light.png');
			});
		});
	});
});