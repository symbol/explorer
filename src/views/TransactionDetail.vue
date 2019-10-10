<template>
  <div class="page">
    <div class="page-content-card-f">
      <Card class="card-f card-full-width">
        <template v-slot:title>Transaction Info</template>
        <template v-slot:control></template>

        <template v-slot:body>
          <loader v-if="loading" />
          <TableInfoView :data="transactionInfo" />
        </template>
      </Card>
      <Card class="card-f card-adaptive">
        <template v-slot:title>Transaction Detail</template>
        <template v-slot:control></template>

        <template v-slot:body>
          <loader v-if="loading" />
          <TableInfoView :data="transactionDetail" />
        </template>
      </Card>

      <Card class="card-f card-adaptive" v-if="transferMosaics.length > 0">
        <template v-slot:title>Mosaics</template>

        <template v-slot:body>
          <TableListView :data="transferMosaics" />
        </template>
      </Card>

      <Card class="card-f card-full-width" v-if="aggregateInnerTransactions.length > 0">
        <template v-slot:title>Aggregate InnerTransactions</template>
        <template v-slot:control></template>

        <template v-slot:body>
          <loader v-if="loading" />
          <TableInfoView :data="aggregateInnerTransactions" />
        </template>
      </Card>

      <Card class="card-f card-full-width" v-if="aggregateCosignatures.length > 0">
        <template v-slot:title>Aggregate Cosignatures</template>
        <template v-slot:control></template>

        <template v-slot:body>
          <loader v-if="loading" />
          <TableInfoView :data="aggregateCosignatures" />
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
      loading: 'transaction/transactionInfoLoading'
    }),

    transactionHash() {
      return this.$route.params.transactionHash
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
