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

<template>
    <div class="page">
        <div class="page-content-card-f">
            <!-- Account Detail -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="accountInfo" />
                </template>

                <template #error>
                    Account {{address}} does not exist
                </template>
            </Card>

            <!-- MultiSig Info -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{multisigTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="accountMultisig" />
                </template>
            </Card>

            <!-- MultiSig Cosignatories -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{cosignatoriesTitle}}
                </template>

                <template #body>
                    <TableListView :data="accountMultisigCosignatories" />
                </template>
            </Card>

            <!-- Mosaics -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{mosaicsTitle}}
                </template>

                <template #body>
                    <TableListView :data="mosaicList" />
                </template>
            </Card>

            <!-- Namespaces -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{namespacesTitle}}
                </template>

                <template #body>
                    <TableListView :data="namespaceList" />
                </template>
            </Card>

            <!-- Transactions -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    {{transactionsTitle}}
                </template>

                <template #control>
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>

                <template #body>
                    <TableListView :data="filteredTransactionList" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
    extends: View,

    data() {
        return {
            detailTitle: 'Account Detail',
            multisigTitle: 'Multisig Info',
            cosignatoriesTitle: 'Multisig Cosignatories',
            mosaicsTitle: 'Owned Mosaics',
            namespacesTitle: 'Owned Namespaces',
            transactionsTitle: 'Transactions',
            transactionTypes: [
                { name: 'All transactions', value: 1 },
                { name: 'Mosaic transactions', value: 2 },
                { name: 'Namespace transactions', value: 3 },
                { name: 'Transfers', value: 4 }
            ],
            selectedTransactionType: 1 // TODO: store.getters
        }
    },

    computed: {
        ...mapGetters({
            accountInfo: 'account/accountInfo',
            accountMultisig: 'account/accountMultisig',
            accountMultisigCosignatories: 'account/accountMultisigCosignatories',
            namespaceList: 'account/namespaceList',
            mosaicList: 'account/mosaicList',
            transactionList: 'account/transactionList',
            loading: 'account/accountInfoLoading',
            error: 'account/accountInfoError'
        }),

        address() {
            return this.$route.params.address || 0
        },

        showDeatail() {
            return !this.error && this.accountInfo
        },
        showMultiSigDeatail() {
            return !this.error && this.accountMultisigCosignatories?.length
        },
        showMosaics() {
            return !this.error && this.mosaicList?.length
        },
        showNamespaces() {
            return !this.error && this.namespaceList?.length
        },
        showTransactions() {
            return !this.error
        },

        filteredTransactionList() {
            if (Array.isArray(this.transactionList)) {
                switch (this.selectedTransactionType) {
                    case 1:
                        return this.transactionList
                    case 2:
                        return this.transactionList.filter(transaction => {
                            const transactionType = transaction.transactionType?.toUpperCase()
                            return transactionType.indexOf('MOSAIC') !== -1
                        })
                    case 3:
                        return this.transactionList.filter(transaction => {
                            const transactionType = transaction.transactionType?.toUpperCase()
                            return transactionType.indexOf('NAMESPACE') !== -1
                        })
                    case 4:
                        return this.transactionList.filter(transaction => {
                            const transactionType = transaction.transactionType?.toUpperCase()
                            return transactionType.indexOf('TRANSFER') !== -1
                        })
                }
            }
            return undefined
        }
    },

    methods: {
        changeTransactionType(transactionType) {
            this.selectedTransactionType = transactionType
        }
    }
}
</script>
