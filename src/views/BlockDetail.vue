<template>
    <div class="page">
        <div class="page-content-card-f">

            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    Block Detail
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
                    Block {{height}} is not exist
                </template>
            </Card>

            <Card class="card-f card-full-width">
                <template #title>
                    Block Transactions
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

  mounted() {
    this.$store.dispatch('block/getBlockInfo', this.height)
  },

  data() {
    return {
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

<style lang="scss" scoped>

</style>
