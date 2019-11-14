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
                        :pagination="true"
                        :pageSize="5"
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
