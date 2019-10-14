<template>
    <div class="page">
        <div class="page-content-card-f">

            <Card class="card-f card-full-width">
                <template v-slot:title>
                    Transaction Detail
                </template>
                <template v-slot:control>

                </template>

                <template v-slot:body>
                    <loader v-if="loading" />
                    <div v-else>
                        <TableInfoView
                            v-if="transactionInfo"
                            :data="transactionInfo"
                        />
                        <div v-else style="font-size: 14px; color: #98a8b4">
                            Transaction <b>{{id}}</b> is not exist
                        </div>
                    </div>
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
    this.$store.dispatch('transaction/getTransactionInfoByHash', this.id)
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
      loading: 'transaction/transactionInfoLoading'
    }),

    id() {
      return this.$route.params.id
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
