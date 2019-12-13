<template>
    <Card :loading="loading">
        <template #title>
            Base Info
        </template>

        <template #body>
            <b-container fluid>
            <b-row>
                <b-col class="ex-item" sm="3" lg="6">
                    <div class="ex-item-title">
                        Price
                    </div>
                    <div class="ex-item-value">
                        {{marketData.price}}
                    </div>
                </b-col>
                <b-col class="ex-item" sm="3" lg="6">
                    <div class="ex-item-title">
                        Market Cap
                    </div>
                    <div class="ex-item-value">
                        {{marketData.marketCap}}
                    </div>
                </b-col>
                <b-col class="ex-item" sm="3" lg="6">
                    <div class="ex-item-title">
                        Total Transactions
                    </div>
                    <div class="ex-item-value">
                        {{chainInfo.numTransactions}}
                    </div>
                </b-col>
                <b-col class="ex-item" sm="3" lg="6">
                    <div class="ex-item-title">
                        Block Height
                    </div>
                    <div class="ex-item-value">
                        {{blockHeight}}
                    </div>
                </b-col>
            </b-row>  
            </b-container>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import { mapGetters } from 'vuex'

export default {
    components: { 
        Card
    },

    computed: {
        ...mapGetters({
            blockHeight: 'chain/getBlockHeight',
            chainInfo: 'chain/getChainInfo',
            marketData: 'chain/getMarketData'
        }),

        loading() { return !this.blockHeight }
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