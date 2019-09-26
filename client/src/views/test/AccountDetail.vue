<template>
    <div class="page">
        <top-header />
        <page-menu />
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
                        :data="ownedMosaicList"
                    />
                </template>
            </Card>


            <Card class="card-f card-adaptive"> <!-- NS -->
                <template v-slot:title>
                    Owned Namespaces
                </template>

                <template v-slot:body>
                    <TableListView
                        :data="ownedNamespaceList"
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
                        :data="trsnsactionList"
                    />
                </template>
            </Card>


        </div>
        <page-footer/>
    </div>
</template>

<script>
import View from './View.vue';
import TableListView from '@/components/tables/TableListView.vue'
import TableInfoView from '@/components/tables/TableInfoView.vue'
import DropDown from '@/components/controls/DropDown.vue'
import Card from '@/components/containers/Card.vue'

export default {
    extends: View,

    components: {
        TableListView,
        TableInfoView,
        Card,
        DropDown
    },

    mounted() {
        this.$store.dispatch('ui/hardCodeInit');
        this.$store.dispatch("account/getAccount", { 
            account: this.account 
        });
    },

    data() {
        return {
            transactionTypes: [
                { name: "Transactions", value: 1 },
                { name: "Mosaic Transactions", value: 2 }
            ],
            selectedTransactionType: 2
        }
    },

    computed: {

        accountName() {
            return "account Name"
        },

        accountInfo() {
            return {
                'address': 'NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q',
                'Public Key': '56a7ae8caca7356fffe98e1dfdf3f4218bb837b5ec6aae927a964e2ff1861e20',
                'balance': '900000216',
                'Vested Balance': '900,000,215.985989',
                'Importance': '8.88583%',
                'Info': 'Post-V1 Fund - 400 - Fund stakes',
                'Multisig account': 'Yes',
                'Min signatures': '6',
                'Cosignatories': `NCYP7E7S67LB4G4Y4RJWE7REFBZI4EXJ73MRKIWW
                                    NDKICABB2EXCLIQ6DHWL66CK7QPYUGLMDVTLUIEB
                                    NADMEHCFJD45GPTDL4HZP2LJLZVAZRLYWYPNEMLY
                                    NALICEXDMHEAVGSWHLSXDMUMCCHTBJLPKPI63IFY
                                    NCOSIGIMCITYNRE7XUR77OREOYFLPAILCNUYLTPD
                                    NCOJAG5GFBUEKABEQQK74PO6QLB65TIKISGLMGS3`
            }
        },

        ownedMosaicList() {
            return [{
                'mosaic': 'unpontify.pontifier:spam-removal',
                'Quantity': '1',
            },
            {
                'mosaic': 'wallet-tokens',
                'Quantity': '1221212',
            }]
        },

        ownedNamespaceList() {
            return [{
                'mosaic': 'unpontify.pontifier:spam-removal',
                'Quantity': '1',
            },
            {
                'mosaic': 'wallet-tokens.najagrsqqp75',
                'Quantity': '1221212',
            }]
        },

        trsnsactionList() {
            return [{
                'address': '2134234234',
                'transactions': 'transaction',
                'namespaces': 'namespace',
                'mosaics': 'mosaic',
                'account': 'account'
            },
            {
                'address': '2134234234',
                'transactions': 'transaction',
                'namespaces': 'namespace',
                'mosaics': 'mosaic',
                'account': 'account'
            }]
        },

    },

    methods: {
        getNameByKey(key){
            return this.$store.getters['ui/getNameByKey'](key)
        },

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