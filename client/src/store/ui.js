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
import { Endpoint } from '../config'

export default {
    namespaced: true,
    state: {
        keyNames: {
            'age': 'Age',
            'amount': 'Amount',
            'height': 'Height',
            'fee': 'Fee',
            'date': 'Date',
            'datetime': 'Date',
            'deadline': 'Deadline',
            'harvester': 'Harvester',
            
            'address': 'Address',
            'account': 'Account',
            'block': 'Block',
            'mosaic': 'Mosaic',
            'namespace': 'Namespace',
            'transaction': 'Transaction',
            'transactionHash': 'Transaction hash',
            'transactionId': 'Transaction id',

            'addressHeight': 'Address height',
            'publicKey': 'Public key',
            'publicKeyHeight': 'PublicKey height',
            'importance': 'Importance',
            'importanceHeight': 'Importance height',
            'accountType': 'Account type',
            'linkedAccountKey': 'Linked account key',

            'accounts': 'Accounts',
            'blocks': 'Blocks',
            'mosaics': 'Mosaics',
            'namespaces': 'Namespaces',
            'transactions': 'Transactions',
            'mosaicId': 'Name',

            'blockHeight': 'Block height',
            'signer': 'Signer',
        },

        keyPages: {
            'height': 'block',

            'harvester': 'account',
            'address': 'account',
            'signer': 'account',

            'transactionHash': 'transaction',
            'transactionId': 'transaction',
            'mosaicId': 'mosaic',

            'addressHeight': 'block',
            'publicKeyHeight': 'block',
            'importanceHeight': 'block',

            'blockHeight': 'block'
        }
    },

    getters: {
        getNameByKey: state => key => state.keyNames[key] != null ? state.keyNames[key] : key
    },

    mutations: {

    },
    actions: {
        openPage: ({ state }, payload) => {
            if (payload.pageName);
            {
                let key = payload.pageName;
                let pageName = state.keyPages[key] || key;
                let value = payload.param;
                if(value != null)
                    router.push({ path: `/test/${pageName}/${value}` });
                else
                    router.push({ path: `/test/${pageName}` });
            }
        },


        search: ({dispatch}, searchString) => {
            return new Promise(async (resolve, reject) => {
                if (searchString !== null && searchString !== '') {
                    searchString = searchString.replace(/[^a-zA-Z0-9]/g, '')
                    if (isBlockHeight(searchString)) {
                        dispatch('openPage', {
                            pageName: 'block',
                            param: searchString
                        });
                        resolve();
                    } 
                    else
                    if(isTransactionId(searchString)) {
                        reject("Search by tx id is not supported yet..")
                        // dispatch('openPage', {
                        //     pageName: 'transaction',
                        //     param: searchString
                        // });
                    }
                    else
                    if (isAccountPublicKey(searchString)) {
                        // check the string is a public key of an account
                        let accountHttp = new AccountHttp(Endpoint.api)
                        let accountAddress
                        let accountInfo
                        try {
                            accountInfo = await accountHttp
                                .getAccountInfo(new Address(searchString))
                                .toPromise()
                            accountAddress = accountInfo?.address?.address
                        } catch (e) { }
                        if (accountAddress) {
                            dispatch('openPage', {
                                pageName: 'account',
                                param: accountAddress
                            });
                            resolve();
                        } 
                        else {
                            // transaction hash
                            dispatch('openPage', {
                                pageName: 'transaction',
                                param: searchString
                            });
                            resolve();
                        }
                    } 
                    else 
                    if (isAccountAddress(searchString)) {
                        dispatch('openPage', {
                            pageName: 'account',
                            param: searchString
                        });
                        resolve();
                    } 
                    else {
                        reject(new Error("Nothing found.."));
                    }
                } 
                else {
                    reject(new Error("Nothing found.."));
                }
            }); 
        }
    }
}

const isTransactionId = (str) => 
    str.length === 24

const isAccountPublicKey = (str) => 
    str.length === 64
    && str.match('^[A-z0-9]+$'); 

const isAccountAddress = (str) =>
    str.length === 40 
    && str.match('^[A-z0-9]+$') 
    && (str.substring(0, 1) === 'S' || str.substring(0, 1) === 's');

const isBlockHeight = (str) => 
    str.match(/^-{0,1}\d+$/);
    


