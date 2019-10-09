<template>
    <div class="page">
        <div class="page-content-card-f">


            <Card class="card-f card-full-width"> <!-- Account Detail -->
                <template v-slot:title>
                    Account Detail
                </template>

                <template v-slot:body>
                    <TableInfoView
                        :data="accountInfo"
                    />
                </template>
            </Card>


            <Card class="card-f card-adaptive "> <!-- Mosaics -->
                <template v-slot:title>
                    Owned Mosaics
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="mosaicList"
                    />
                </template>
            </Card>


            <Card class="card-f card-adaptive"> <!-- NS -->
                <template v-slot:title>
                    Owned Namespaces
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="namespaceList"
                    />
                </template>
            </Card>


            <Card class="card-f card-full-width"> <!-- Transactions -->
                <template v-slot:title>
                    Transactions
                </template>
                <template v-slot:control>
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="transactionList"
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
        this.$store.dispatch('account/fetchAccountDataByAddress', this.address)
    },

    data() {
        return {
            transactionTypes: [
                { name: "Transactions", value: 1 },
                { name: "Mosaic Transactions", value: 2 }
            ],
            selectedTransactionType: 1 // TODO: store.getters
        }
    },

    computed: {
        ...mapGetters({
            accountInfo: 'account/accountInfo',
            namespaceList: 'account/namespaceList',
            mosaicList: 'account/mosaicList',
            transactionList: 'account/transactionList',
        }),

        address() {
            return this.$route.params.address || 0;
        },

    },

    methods: {
        changeTransactionType(v){
            this.selectedTransactionType = v;
            this.$store.dispatch("account/getTransactions", {
                transactionType: this.selectedTransactionType
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>