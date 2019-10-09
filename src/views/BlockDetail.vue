<template>
    <div class="page">
        <div class="page-content-card-f">


            <Card 
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    Block Detail
                </template>
                <template #control>
                    <Pagination
                        :pageIndex="1"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>


                <template #body>
                    <TableInfoView
                        :data="blockInfo"
                    />
                </template>
            </Card>



            <Card
                class="card-f card-full-width"
                v-if="isTransactions"
            >
                <template #title>
                    Block Transactions
                </template>


                <template #body>
                    <TableListView
                        :data="blockTransactionList"
                    />
                </template>
            </Card>

        </div>
    </div>
</template>

<script>
import View from './View.vue';
import { mapGetters } from 'vuex'

export default {
    extends: View,

    mounted() {
        this.$store.dispatch('block/getBlockInfo', this.height)
    },

    data() {
        return {
            nextPageAction: "block/nextBlock",
            previousPageAction: "block/previousBlock"
        }
    },

    computed: {
        ...mapGetters({
            blockInfo: 'block/blockInfo',
            blockTransactionList: 'block/blockTransactionList',
            loading: 'block/blockInfoLoading'
        }),

        height() {
            return this.$route.params.height
        },

        isTransactions() {
            return this.blockTransactionList.length
        }
    },
}
</script>

<style lang="scss" scoped>

</style>