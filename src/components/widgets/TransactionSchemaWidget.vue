<template>
    <Card :loading="loading">
        <template #title>{{getNameByKey('transactionSchema')}}</template>

        <template #body>
            <div class="body">
                <TransactionSchema v-bind="data" />
            </div>
        </template>
    </Card>
</template>

<script>
import Card from "@/components/containers/Card.vue";
import TransactionSchema from "@/components/transaction-schema/TransferTransactionSchema.vue";

export default {
    props: {
        managerGetter: String
    },

    components: {
        Card,
        TransactionSchema
    },

    computed: {
        data() {
            return this.$store.getters[this.managerGetter].data;
        },

        loading() {
            return this.$store.getters[this.managerGetter].loading;
        },

        error() {
            return this.$store.getters[this.managerGetter].error;
        }
    },

    methods: {
        getNameByKey(e) {
            return this.$store.getters["ui/getNameByKey"](e);
        }
    }
};
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    justify-content: center;
}
</style>
