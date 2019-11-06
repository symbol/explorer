<template>
  <div class="page">
    <div class="page-content-card-f">
      <Card
        class="card-f card-full-width"
        :loading="loading"
        :error="error"
      >
        <template #title>Transaction Info</template>
        <template #control></template>

        <template #body>
          <TableInfoView :data="transactionInfo" />
        </template>
        <template #error>Transaction with hash - {{transactionHash}} does not exist</template>
      </Card>
      <Card
        class="card-f card-adaptive"
        v-if="showTransactionDetail"
        :loading="loading"
      >
        <template #title>Transaction Detail</template>
        <template #control></template>

        <template #body>
          <TableInfoView :data="transactionDetail" />
        </template>
      </Card>

      <Card
        class="card-f card-adaptive"
        v-if="showTransferMosaics"
        :loading="loading"
      >
        <template #title>Mosaics</template>

        <template #body>
          <TableListView :data="transferMosaics" />
        </template>
      </Card>

      <Card
        class="card-f card-full-width"
        v-if="showAggregateInnerTransactions"
        :loading="loading"
      >
        <template #title>Aggregate InnerTransactions</template>
        <template #control></template>

        <template #body>
          <TableListView :data="aggregateInnerTransactions" />
        </template>
      </Card>

      <Card
        class="card-f card-full-width"
        v-if="showAggregateCosignatures"
        :loading="loading"
      >
        <template #title>Aggregate Cosignatures</template>
        <template #control></template>

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

  mounted() {
    this.$store.dispatch(
      'transaction/getTransactionInfoByHash',
      this.transactionHash
    )
  },

  data() {
    return {
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

<style lang="scss" scoped>
</style>
