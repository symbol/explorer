import helper from '../../src/helper';
import { NodeService } from '../../src/infrastructure';
import api from '../../src/store/api';
import { createLocalVue } from '@vue/test-utils';
import { stub } from 'sinon';
import { Account } from 'symbol-sdk';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

/**
 * Mock node object
 * @param {number} numberOfNodes number of nodes to mock.
 * @returns {object} node object
 */
const stubMockNode = numberOfNodes => {
	return [...Array(numberOfNodes).keys()].map(index => {
		const account = Account.generateNewAccount(152);
		const nodeIndex = index + 1;
		return {
			publicKey: account.publicKey,
			roles: 'Peer Api node',
			friendlyName: `mock_${nodeIndex}`,
			networkGenerationHashSeed: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
			port: 7900,
			networkIdentifier: 152,
			host: `mock_${nodeIndex}.com`,
			nodePublicKey: account.publicKey,
			address: account.address.plain(),
			rolesRaw: 3,
			network: 'TESTNET',
			apiEndpoint: `https://mock_${nodeIndex}.com:3001`
		};
	});
};

describe('store/api', () => {
	describe('action loadNodeList should', () => {
		let nodes = [];

		beforeEach(() => {
			nodes = stub(NodeService, 'getAPINodeList');
		});

		afterEach(() => {
			nodes.restore();
		});

		it('add selected node into node list', async () => {
			// Arrange:
			const commit = jest.fn();

			const getters = {
				currentNode: 'http://localhost:3000'
			};

			nodes.returns(Promise.resolve(stubMockNode(2)));

			// Act:
			await api.actions.loadNodeList({ commit, getters });

			// Assert:
			expect(commit).toHaveBeenCalledTimes(1);
			expect(commit).toHaveBeenNthCalledWith(
				1,
				'setNodes',
				['https://mock_1.com:3001', 'https://mock_2.com:3001' ,'http://localhost:3000']
			);
		});

		it('load node list with random node', async () => {
			// Arrange:
			const commit = jest.fn();

			const getters = {
				currentNode: undefined
			};

			nodes.returns(Promise.resolve(stubMockNode(1)));

			// Act:
			await api.actions.loadNodeList({commit, getters});

			// Assert:
			expect(commit).toHaveBeenCalledTimes(2);
			expect(commit).toHaveBeenNthCalledWith(1, 'setNodes', ['https://mock_1.com:3001']);
			expect(commit).toHaveBeenNthCalledWith(2, 'currentNode', helper.parseUrl('https://mock_1.com:3001'));
		});
	});

	describe('action changeNode should', () => {
		it('update selected node', async() => {
			// Arrange:
			const commit = jest.fn();

			const selectedNode = 'https://new-node.com:3000';

			// Act:
			await api.actions.changeNode({ commit }, selectedNode);

			// Assert:
			expect(commit).toHaveBeenCalledTimes(2);
			expect(commit).toHaveBeenNthCalledWith(1, 'currentNode', selectedNode);
			expect(commit).toHaveBeenNthCalledWith(2, 'setInitialized', false);
		});
	});
});
