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
                    <TableListView :data="aggregateInnerTransactions" :pagination="true" :pageSize="5" />
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
                    <TableListView :data="aggregateCosignatures" :pagination="true" :pageSize="5" />
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
