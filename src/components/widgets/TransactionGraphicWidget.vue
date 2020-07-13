<template>
    <Card :loading="loading">
        <template #title>{{getNameByKey('transactionGraphic')}}</template>

        <template #body>
            <div class="body">
                <TransferGraphic v-if="TransactionTypes[data.type] === 'Transfer'" v-bind="data" />
                <AddressAliasGraphic v-if="data.type === 16974" v-bind="data" />
                <NamespaceRegistrationGraphic v-if="data.type === 16718" v-bind="data" />
            </div>
        </template>
    </Card>
</template>

<script>
import Constants from '@/config/constants'
import Card from '@/components/containers/Card.vue'
import TransferGraphic from '@/components/transaction-graphic/TransferGraphic.vue'
import AddressAliasGraphic from '@/components/transaction-graphic/AddressAliasGraphic.vue'
import NamespaceRegistrationGraphic from '@/components/transaction-graphic/NamespaceRegistrationGraphic.vue'

export default {
  props: {
    managerGetter: String
  },

  components: {
    Card,
    TransferGraphic,
    AddressAliasGraphic,
    NamespaceRegistrationGraphic
  },

  data() {
    return {
      TransactionTypes: Constants.TransactionType
    }
  },

  computed: {
    data() {
      return this.$store.getters[this.managerGetter].data
    },

    loading() {
      return this.$store.getters[this.managerGetter].loading
    },

    error() {
      return this.$store.getters[this.managerGetter].error
    }
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    }
  }
}
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    justify-content: center;
}
</style>
