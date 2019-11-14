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
            <!-- Transaction Info -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{infoTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="transactionInfo" />
                </template>

                <template #error>
                    Transaction with hash {{transactionHash}} does not exist
                </template>
            </Card>

            <!-- Transaction Detail -->
            <Card
                class="card-f card-adaptive"
                v-if="showTransactionDetail"
                :loading="loading"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="transactionDetail" />
                </template>
            </Card>

            <!-- Mosaics -->
            <Card
                class="card-f card-adaptive"
                v-if="showTransferMosaics"
                :loading="loading"
            >
                <template #title>
                    {{mosaicsTitle}}
                </template>

                <template #body>
                    <TableListView :data="transferMosaics" />
                </template>
            </Card>

            <!-- Aggregate Inner Transactions -->
            <Card
                class="card-f card-full-width"
                v-if="showAggregateInnerTransactions"
                :loading="loading"
            >
                <template #title>
                    {{aggregateTitle}}
                </template>

                <template #body>
                    <TableListView :data="aggregateInnerTransactions" />
                </template>
            </Card>

            <!-- Aggregate Cosignatures -->
            <Card
                class="card-f card-full-width"
                v-if="showAggregateCosignatures"
                :loading="loading"
            >
                <template #title>
                    {{cosignaturesTitle}}
                </template>

                <template #body>
                    <TableListView :data="aggregateCosignatures" />
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
            infoTitle: 'Transaction Info',
            detailTitle: 'Transaction Detail',
            mosaicsTitle: 'Mosaics',
            aggregateTitle: 'Aggregate Inner Transactions',
            cosignaturesTitle: 'Aggregate Cosignatures',
            nextPageAction: 'transaction/nextTransaction',
            previousPageAction: 'transaction/previousTransaction'
        }
    },

    computed: {
        ...mapGetters({
            transactionInfo: 'transaction/transactionInfo',
            transactionDetail: 'transaction/transactionDetail',
            transferMosaics: 'transaction/transferMosaics',
            aggregateInnerTransactions: 'transaction/aggregateInnerTransactions',
            aggregateCosignatures: 'transaction/aggregateCosignatures',
            loading: 'transaction/transactionInfoLoading',
            error: 'transaction/transactionInfoError'
        }),

        transactionHash() {
            return this.$route.params.transactionHash
        },

        showTransactionDetail() {
            return !this.error
        },

        showTransferMosaics() {
            return this.transferMosaics?.length > 0
        },

        showAggregateInnerTransactions() {
            return this.aggregateInnerTransactions?.length > 0
        },

        showAggregateCosignatures() {
            return this.aggregateCosignatures?.length > 0
        }
    }
}
</script>
