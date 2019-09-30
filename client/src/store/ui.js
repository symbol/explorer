/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import router from '../router';

export default {
    namespaced: true,
    state: {
        keyNames: {
            'age': 'Age',
            'amount': 'Amount',
            'height': 'Height',
            'fee': 'Fee',
            'date': 'Date',
            'harvester': 'Harvester',
            'datetime': 'Date',
            'address': 'Address',
            'account': 'Account',
            'block': 'Block',
            'mosaic': 'Mosaic',
            'namespace': 'Namespace',
            'transaction': 'Transaction',
            'transactionHash': 'Transaction hash',

            'accounts': 'Accounts',
            'blocks': 'Blocks',
            'mosaics': 'Mosaics',
            'namespaces': 'Namespaces',
            'transactions': 'Transactions',
            'mosaicId': 'Name'
        },

        keyPages: {
            'height': 'block',

            'harvester': 'account',
            'address': 'account',

            'transactionHash': 'transaction',

            'mosaicId': 'mosaic',
        }
    },

    getters: {
        getNameByKey: state => key => state.keyNames[key] != null ? state.keyNames[key] : key
    },
    
    mutations: {
    
    },
    actions: {
        openPage: ({state}, payload) => {
            if(payload.pageName && payload.param);
            {
                let key = payload.pageName;
                let pageName = state.keyPages[key] || key;
                let value = payload.param;
                router.push({ path: `/test/${pageName}/${value}` });
            }
        },

        hardCodeInit: ({rootState}) => {
            let blockList = [
                {
                    address: "address1",
                    account: "account1",
                    block: "block1",
                    datetime: 1213234213
                },
                {
                    address: "address2",
                    account: "account2",
                    block: "block2",
                    datetime: 1213234212
                },
            ];

            rootState.block.pageList = blockList;
        }
    }
}
