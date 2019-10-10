<template>
    <div class="page">
        <div class="page-content-card-f">


            <Card 
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            > <!-- Account Detail -->
                <template #title>
                    Account Detail
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


            <Card 
                v-if="showMosaics"
                class="card-f card-adaptive"
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
                class="card-f card-adaptive"
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


            <Card 
                v-if="showTransactions"
                class="card-f card-full-width"
                :loading="loading"
            > <!-- Transactions -->
                <template #title>
                    Transactions
                </template>
                <template #control>
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>

                <template #body>
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
            loading: 'account/accountInfoLoading',
            error: 'account/accountInfoError',
        }),

        address() {
            return this.$route.params.address || 0;
        },

        showDeatail() { return !this.error && this.accountInfo },
        showMosaics() { return !this.error && this.mosaicList?.length },
        showNamespaces() { return !this.error && this.namespaceList?.length },
        showTransactions() {return !this.error}

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