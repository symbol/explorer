<template>
    <Card :loading="loading">
        <template #title>
            XEM Price
        </template>

        <template #control>
            <ButtonMore> View all statistics </ButtonMore>
        </template>

        <template #body>
            <b-row>
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
        .ex-title-text {
            color: black;
        }

        .ex-long-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        padding: 0;
        .ex-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            
            .ex-text {
                font-size: 10px;
                color: #acacac;
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