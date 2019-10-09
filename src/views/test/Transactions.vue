<template>
    <div class="page">
        <div class="page-content-card-f">

            
            <Card class="card-f card-full-width"> 
                <template v-slot:title>
                    Transactions 
                </template>
                <template v-slot:control>
                    <Pagination
                        v-if="pageIndex !== 0"
                        :pageIndex="pageIndex"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                    <DropDown 
                        v-else
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>
                
                <template v-slot:body>
                    <loader v-if="loading" />
                    <TableListView
                        :data="transactionList"
                    />
                    <Pagination
                        style="margin-top: 20px;"
                        :pageIndex="pageIndex"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
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
        this.$store.dispatch('transaction/initialize')
    },

    data() {
        return {
            nextPageAction: 'transaction/fetchNextPage',
            previousPageAction: 'transaction/fetchPreviousPage',
            transactionTypes: [
                { name: "Transactions", value: 1 },
                { name: "Mosaic Transactions", value: 2 }
            ],
            selectedTransactionType: 1 // TODO: store.getters
        }
    },

    computed: {
        ...mapGetters({
            transactionList: 'transaction/pageListFormatted',
            loading: 'transaction/getLoading',
            pageIndex: 'transaction/getPageIndex'
        }),

    },

    methods: {
        changeTransactionType(e) {
            this.selectedTransactionType = e;
        }
    },

    destroyed() {
        this.$store.dispatch('transaction/resetPage')
    }
}
</script>

<style lang="scss" scoped>

</style>