<template>
    <div class="page">
        <top-header />
        <page-menu />
        <div class="page-content">

            <Card>
                <template v-slot:header>
                    <div style="width: 100%; display: flex; justify-content: space-between">
                        {{title}}
                        <DropDown 
                            :value="ddvalue"
                            :options="ddoptions"
                            @change="ddchange"
                        />
                    </div>
                </template>

                <template v-slot:body>
                    <TableInfoView
                        :data="accountInfo"
                    />
                </template>
            </Card>

            <Card>
                <template v-slot:header>
                    <div>
                        <div>{{title}}</div>
                        <div>{{accountName}}</div>
                    </div>
                </template>

                <template v-slot:body>
                    <TableInfoView
                        :data="accountInfo"
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
        this.$store.dispatch('ui/hardCodeInit')
    },

    data() {
        return {
            ddoptions: [
                { name: "Value 1", value: 1 },
                { name: "Value 2", value: 2 }
            ],
            ddvalue: 2
        }
    },

    computed: {
        title() {
            return this.getNameByKey('Account') + " " + this.getNameByKey('Detail');
        },

        accountName() {
            return "account Name"
        },

        accountInfo() {
            return {
                'address': '2134234234',
                'transactions': 'transaction',
                'namespaces': 'namespace',
                'mosaics': 'mosaic',
                'account': 'account'
            }
        } 

    },

    methods: {
        getNameByKey(key){
            return this.$store.getters['ui/getNameByKey'](key)
        },

        ddchange(v){
            this.ddvalue = v;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>