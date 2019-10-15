<template>
    <div class="page-con">
       <div class="full-con mob_con">
        <div class="container p-0">


            <Card 
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                     <h1 class="inline-block">Block Detail</h1>                
                </template>
                <template #control>
                    <div class="inline-block float-r">
                    <Pagination
                        :pageIndex="1"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                    </div>
                </template>


                <template #body>
                    <TableInfoView
                        :data="blockInfo"
                    />
                </template>
                <template #error>
                    Block {{height}} is not exist
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
            loading: 'block/blockInfoLoading',
            error: 'block/blockInfoError'
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