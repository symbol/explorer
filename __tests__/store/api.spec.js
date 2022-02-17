import { NodeService } from '../../src/infrastructure';
import api from '../../src/store/api';
import { createLocalVue } from '@vue/test-utils';
import { stub } from 'sinon';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/api', () => {
	describe('action loadNodeList should', () => {
		// Mock
		const mockApiNodeList = [{
            publicKey: 'B44144608FCC7CB60B55505849A3E07A8837549DDC886968B30B0568976C0B41',
            roles: 'Peer Api node',
            friendlyName: 'mock1',
            networkGenerationHashSeed: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
            port: 7900,
            networkIdentifier: 152,
            host: 'mock1.com',
            nodePublicKey: 'B44144608FCC7CB60B55505849A3E07A8837549DDC886968B30B0568976C0B41',
            address: 'TCTSR5BB4WSRZ2TPFUVSG2HR6BGYJ7JUK2ZDGLA',
            rolesRaw: 3,
            network: 'TESTNET',
            apiEndpoint: 'https://mock1.com:3001'
        },
        {
            publicKey: '9463FD29F98D47EBE8CE697F29AA060A45912845225352AFBD31961F742AFCC6',
            roles: 'Peer Api node',
            friendlyName: 'mock2',
            networkGenerationHashSeed: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
            port: 7900,
            networkIdentifier: 152,
            host: 'mock2.com',
            nodePublicKey: '9463FD29F98D47EBE8CE697F29AA060A45912845225352AFBD31961F742AFCC6',
            address: 'TAINMOVAIHUWFN6NFLBR7EGTVJH6W3MBE4FOVDI',
            rolesRaw: 3,
            network: 'TESTNET',
            apiEndpoint: 'https://mock2:3001'
        }];

		const nodes = stub(NodeService, 'getAPINodeList');
		nodes.returns(Promise.resolve(mockApiNodeList));

		it('add selected node into node list.', async () => {
			// Arrange
            const commit = jest.fn();
            const getters = {
                currentNode: 'http://localhost:3000'
            }

			// Act
			await api.actions.loadNodeList({ commit, getters });

			// Assert
			expect(commit).toHaveBeenCalledTimes(1);
			expect(commit).toHaveBeenNthCalledWith(1, 'setNodes', ['https://mock1.com:3001', 'https://mock2:3001' ,'http://localhost:3000']);
		});

		it('load node list with random node.', async () => {
			// Arrange
            const commit = jest.fn();
            const getters = {
                currentNode: undefined
            }

			// Act
			await api.actions.loadNodeList({commit, getters});

			// Assert
			expect(commit).toHaveBeenCalledTimes(2);
			expect(commit).toHaveBeenNthCalledWith(1, 'setNodes', ['https://mock1.com:3001', 'https://mock2:3001']);
		});
	});

    describe('action changeNode should', () => {
        it('update selected node.', async() => {
            // Arrange
			const commit = jest.fn();

            const selectedNode = 'https://new-node.com:3000';

            // Act
			await api.actions.changeNode({ commit }, selectedNode);

            // Assert
			expect(commit).toHaveBeenCalledTimes(2);
            expect(commit).toHaveBeenNthCalledWith(1, 'currentNode', selectedNode);
            expect(commit).toHaveBeenNthCalledWith(2, 'setInitialized', false);
        })
    })

});