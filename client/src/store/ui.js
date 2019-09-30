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
import { Address, AccountHttp } from 'nem2-sdk'

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
        openPage: ({ state }, payload) => {
            if (payload.pageName && payload.param);
            {
                let key = payload.pageName;
                let pageName = state.keyPages[key] || key;
                let value = payload.param;
                router.push({ path: `/test/${pageName}/${value}` });
            }
        },

        hardCodeInit: ({ rootState }) => {
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
        },

        search: ({dispatch}, searchString) => {
            return new Promise(async (resolve, reject) => {
                searchString = searchString.replace(/[^a-zA-Z0-9]/g, '')
                if (searchString !== null && searchString !== '') {
                    if (searchString.match(/^-{0,1}\d+$/)) {
                        dispatch('openPage', {
                            pageName: 'block',
                            param: searchString
                        })
            
                    } else if (
                        searchString.match('^[A-z0-9]+$') &&
                        searchString.length === 64
                    ) {
                        // check the string is a public key of an account
                        let accountHttp = new AccountHttp(Endpoint.api)
                        let accountAddress
                        let accountInfo
                        try {
                            accountInfo = await accountHttp
                                .getAccountInfo(new Address(searchString))
                                .toPromise()
                            accountAddress = accountInfo.address.address
                        } catch (e) { }
                        if (accountAddress) {
                            dispatch('openPage', {
                                pageName: 'account',
                                param: accountInfo.address.address
                            })
                        } else {
                            // transaction hash
                            dispatch('openPage', {
                                pageName: 'transaction',
                                param: searchString
                            })
                        }
                    } else if (
                        searchString.match('^[A-z0-9]+$') &&
                        (searchString.substring(0, 1) === 'S' ||
                            searchString.substring(0, 1) === 's') &&
                        searchString.length === 40
                    ) {
                        dispatch('openPage', {
                            pageName: 'account',
                            param: searchString
                        })
                    } else {
                        reject(new Error("Nothing found"));
                    }
                } else {
                    reject(new Error("Nothing found"));
                }
            }); 
        }
    }
}


