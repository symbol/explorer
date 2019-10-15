<template>
     <div class="page-con">
       <div class="full-con mob_con">
        <div class="container p-0">


            <Card
                class=""
                :loading="loading"
                :error="error"
            > <!-- Account Detail -->
                <template #title>
                   <h1 class="inline-block">Account Detail</h1>     
                </template>

                <template #body>
                    <TableInfoView
                        :data="accountInfo"
                    />
                </template>
                <template #error>
                    Account {{address}} is not exist
                </template>
            </Card>
        </div>


        <div class="container p-0">
            <div class="multi-w-row">
            <Card
                v-if="showMosaics"
                class=""
                :loading="loading"
            > <!-- Mosaics -->
                <template #title>
                    Owned Mosaics
                </template>

                <template #body>
                    <TableListView
                        :data="mosaicList"
                    />
                </template>
            </Card>


            <Card
                v-if="showNamespaces"
                class=""
                :loading="loading"
            > <!-- NS -->
                <template #title>
                    Owned Namespaces
                </template>

                <template #body>
                    <TableListView
                        :data="namespaceList"
                    />
                </template>
            </Card>
            </div>
        </div>


        <div class="container p-0">
            <Card
                v-if="showTransactions"
                class=""
                :loading="loading"
            > <!-- Transactions -->
                <template #title>
                    Transactions
                </template>
                <template #control>
                    <div class="inline-block float-r">
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                    </div>
                </template>

                <template #body>
                    <TableListView
                        :data="filteredTransactionList"
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
        this.$store.dispatch('account/fetchAccountDataByAddress', this.address)
    },

    data() {
        return {
            transactionTypes: [
                { name: "All transactions", value: 1 },
                { name: "Mosaic transactions", value: 2 },
                { name: "Namespace transactions", value: 3 },
                { name: "Transfers", value: 4 }
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
            loading: 'account/accountInfoLoading',
            error: 'account/accountInfoError',
        }),

        address() {
            return this.$route.params.address || 0;
        },

        showDeatail() { return !this.error && this.accountInfo },
        showMosaics() { return !this.error && this.mosaicList?.length },
        showNamespaces() { return !this.error && this.namespaceList?.length },
        showTransactions() {return !this.error},

        filteredTransactionList() {
            if(Array.isArray(this.transactionList))
                switch(this.selectedTransactionType) {
                    case 1:
                        return this.transactionList;
                    case 2:
                        return this.transactionList.filter( transaction =>
                            transaction.transactionType?.toUpperCase().indexOf("MOSAIC") !== -1
                        )
                    case 3:
                        return this.transactionList.filter( transaction =>
                            transaction.transactionType?.toUpperCase().indexOf("NAMESPACE") !== -1
                        )
                    case 4:
                        return this.transactionList.filter( transaction =>
                            transaction.transactionType?.toUpperCase().indexOf("TRANSFER") !== -1
                        )
                }
        }

    },

    methods: {
        changeTransactionType(v){
            this.selectedTransactionType = v;
            // this.$store.dispatch("account/getTransactions", {
            //     transactionType: this.selectedTransactionType
            // });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>