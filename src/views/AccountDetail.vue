<template>
   <div class="full-con mob_con">
       <div class="container p-0 mt-1">
            
            <Card 
                class="widget has-shadow"
                :loading="loading"
            > <!-- Account Detail -->
                <template #title>
                    Account Detail
                </template>

                <template #body>
                    <TableInfoView
                        :data="accountInfo"
                    />
                </template>
            </Card>


            <Card 
                v-if="hasMosaics"
               class="widget has-shadow"
            > <!-- Mosaics -->
                <template v-slot:title>
                    Owned Mosaics
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="mosaicList"
                    />
                </template>
            </Card>


            <Card 
                v-if="hasNamespaces"
               class="widget has-shadow"
            > <!-- NS -->
                <template v-slot:title>
                    Owned Namespaces
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="namespaceList"
                    />
                </template>
            </Card>


            <Card class="widget has-shadow"> <!-- Transactions -->
                <template v-slot:title>
                    Transactions
                </template>
                <template v-slot:control >
                    <div class="inline-block flt-rt">
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                    </div>
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

        hasDeatail() { return this.accountInfo },
        hasMosaics() { return this.mosaicList?.length },
        hasNamespaces() { return this.namespaceList?.length },

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