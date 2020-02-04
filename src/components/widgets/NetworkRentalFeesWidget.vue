<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey('Network Rental Fees')}}
        </template>

        <template #body>
            <b-container fluid>
            <b-row>
                <b-col
                    sm="4"
                    md="4"
                    lg="4"
                    v-for="(item, index) in networkfees"
                    :key="'network_fee'+index+'_'+item.fast"
                >
                    <Card
                        class='card-item'
                        :item="item"
                    >
                        <template #header>
                            {{getNameByKey(item.name)}}
                        </template>
                        <template #body>
                            <Decimal :value="item.fees" />
                             / Block
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
import ButtonMore from '@/components/controls/ButtonMore.vue'
import Decimal from '@/components/Decimal.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Card,
    ButtonMore,
    Decimal
  },

  data() {
    return {
        networkfees: [
            {name: 'Root Namespace',
            fees: '0.000001 xem',},
            { name: 'Child Namespace',
            fees: '0.0001 xem'},
            { name: 'Mosaic',
            fees: '0.0005 xem'}]
            }
  },

  computed: {
    ...mapGetters({
      blockList: 'block/getRecentList',
      loading: 'block/getLoading',
    }),
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
    background: #78b6e4;
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
