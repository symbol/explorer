<template>
    <Card :loading="false">
        <template #title>
            {{getNameByKey('transactionSchema')}}
        </template>

        <template #body>
            <div class="body">
                <TransactionSchema :managerGetter="managerGetter" />
            </div>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import TransactionSchema from '@/components/TransactionSchema.vue'

export default {
    props: {
        managerGetter: String
    },

  components: {
    Card,
    TransactionSchema
  },

  computed: {
    loading() { return !this.blockHeight }
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
