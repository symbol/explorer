<template>
    <Card :loading="loading">
        <template #title>
            XEM Price
        </template>

        <template #control>
            <ButtonMore> View all statistics </ButtonMore>
        </template>

        <template #body>
            <b-row style="margin: -20px">
                <b-col>
                    <Chart 
                        type="area"
                        :data="chartData"
                    />
                </b-col>
            </b-row>  
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import ButtonMore from '@/components/controls/ButtonMore.vue'
import Chart from '@/components/Chart.vue'
import { mapGetters } from 'vuex'

export default {
    components: { 
        Card, 
        ButtonMore,
        Chart 
    },

    computed: {
        ...mapGetters({
            marketData: 'chain/getMarketData'
        }),

        chartData() {
            return [
            {
                name: 'Price (USD)',
                data: this.marketData.historicalHourlyGraph
            }
        ]
        },

        loading() { return !this.marketData.historicalHourlyGraph.length }
    }
}
</script>