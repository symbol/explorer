<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey(transactionPerDayData.name)}}
        </template>

        <template #body>
            <!-- From {{ transactionPerDayData.fromBlocks }} to  {{ transactionPerDayData.toBlocks }} -->
            <b-row style="margin: -20px">
                <b-col>
                    <Chart
                        type="bar"
                        :data="chartData"
                        xaxisType="text"
                    />
                </b-col>
            </b-row>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import Chart from '@/components/Chart.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Card,
    Chart
  },

  computed: {
    ...mapGetters({
      transactionPerDayData: 'statistics/getTransactionPerDayData'
    }),

    chartData() {
      return this.transactionPerDayData.chartData
    },

    loading() { return !this.transactionPerDayData.chartData }
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    }
  }
}
</script>
