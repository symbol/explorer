<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey('Network Fees')}}
        </template>

        <template #body>
            <b-container fluid>
            <b-row>
                <b-col
                    sm="4"
                    md="4"
                    lg="4"
                    v-for="(item, index) in networkTransactionFees"
                    :key="'network_fee'+index+'_'+item.netoworkFeesType"
                >
                    <Card
                        class='card-item'
                        :item="item"
                        :loading="loading"
                        :error="error"
                    >
                        <template #header>
                            {{getNameByKey(item.netoworkFeesType)}}
                        </template>
                        <template #body>
                            <Decimal :value="item.fees" /> {{item.remark}}
                        </template>
                    </Card>
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
.card-item::before {
    width: 4px;
    content: '';
    height: 100%;
    position: absolute;
    padding: 0;
    left: 0;
    top: 0;
    background: #3e6b8c;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}

.card-item {
    .card-body {
        padding: 0;

        .ex-title-text {
            color: black;
        }

        .ex-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .ex-text {
                font-size: 10px;
                color: #acacac;
            }

            .ex-long-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .ex-account-text {
                color: #84accb;
                font-weight: 600;
                font-size: 12px;
                margin-left: 20px;
            }
        }

        .no-wrap {
            flex-wrap: nowrap;
        }
    }
}
</style>
