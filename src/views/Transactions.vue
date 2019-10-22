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
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    Transactions
                </template>
                <template #body>
                    <TransactionTypeBox/>
                    <TransactionTable
                        :transactionList="transactionList"
                    />
                    <PaginationV2
                        style="margin-top: 20px;"
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import w1 from '@/components/TransactionTypeBox.vue'
import w2 from '@/components/TransactionTable.vue'
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
    extends: View,

    components: {
        TransactionTypeBox: w1,
        TransactionTable: w2
    },

    mounted() {
        this.$store.dispatch('transaction/initialize')
    },

    data() {
        return {
            nextPageAction: 'transaction/fetchNextPage',
            previousPageAction: 'transaction/fetchPreviousPage'
        }
    },

    computed: {
        ...mapGetters({
            transactionList: 'transaction/getTimelineList',
            canFetchPrevious: 'transaction/getCanFetchPrevious',
            canFetchNext: 'transaction/getCanFetchNext',
            loading: 'transaction/getLoading'
        })
    }
}
</script>
