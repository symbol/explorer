<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey('Block time differences in last 240 blocks (1 hours)')}}
        </template>

        <template #body>
            <b-row style="margin: -20px">
                <b-col>
                    <Chart
                        type="line"
                        :data="chartData"
                        xaxisType="numeric"
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
      blockTimeDifferenceData: 'statistics/getBlockTimeDifferenceData'
    }),

    chartData() {
      return this.blockTimeDifferenceData
    },

    loading() { return !this.blockTimeDifferenceData.length }
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    }
  }
}
</script>
