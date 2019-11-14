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
            <!-- Block Detail -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #control>
                    <Pagination
                        :canFetchPrevious="true"
                        :canFetchNext="true"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>

                <template #body>
                    <TableInfoView
                        :data="blockInfo"
                    />
                </template>

                <template #error>
                    Block {{height}} does not exist
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

                <template #body>
                    <TableListView
                        :data="blockTransactionList"
                        :emptyDataMessage="'No transactions to display for this block'"
                    />
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
            detailTitle: 'Block Detail',
            transactionsTitle: 'Block Transactions',
            nextPageAction: 'block/nextBlock',
            previousPageAction: 'block/previousBlock'
        }
    },

    computed: {
        ...mapGetters({
            blockInfo: 'block/blockInfo',
            blockTransactionList: 'block/blockTransactionList',
            loading: 'block/blockInfoLoading',
            error: 'block/blockInfoError'
        }),

        height() {
            return this.$route.params.height
        },

        isTransactions() {
            return this.blockTransactionList.length
        }
    }
}
</script>
