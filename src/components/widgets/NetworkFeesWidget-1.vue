<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey('Network Fees')}}
        </template>

        <template #body>
            <b-container fluid>
            <b-row>
                <b-col class="ex-item" sm="3" lg="6"
                    v-for="(item, index) in networkTransactionFees"
                    :key="'network_fee'+index+'_'+item.netoworkFeesType">
                    <div class="ex-item-title">
                        {{getNameByKey(item.netoworkFeesType)}}
                    </div>
                    <div class="ex-item-value">
                        <Decimal :value="item.fees" />
                    </div>
                </b-col>
            </b-row>
            </b-container>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import Decimal from '@/components/Decimal.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Card,
    Decimal
  },

  computed: {
    ...mapGetters({
      networkTransactionFees: 'statistics/getNetworkTransactionFees',
      loading: 'statistics/getLoading',
      error: 'statistics/getError'
    })
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    }
  }
}
</script>

<style lang="scss" scoped>
.ex-item {
    border-left: 4px solid #0998a6;
    padding: 1px 10px;
    margin-bottom: 15px;

    .ex-item-title {
        color: rgb(187, 187, 187);
        font-size: 12px;
    }

    .ex-item-value {
        color: rgb(85, 85, 85);
        text-align: left;
        font-size: 14px;
        margin: 4px 0 0;
    }
}
</style>
