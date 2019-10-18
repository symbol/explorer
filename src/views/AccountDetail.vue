<template>
  <div class="page">
    <div class="page-content-card-f">
      <Card class="card-f card-full-width" :loading="loading" :error="error">
        <!-- Account Detail -->
        <template #title>Account Detail</template>

        <template #body>
          <TableInfoView :data="accountInfo" />
        </template>
        <template #error>Account {{address}} is not exist</template>
      </Card>

      <Card v-if="1||showMultiSigDeatail" class="card-f card-adaptive" :loading="loading">
        <!-- MultiSig Info -->
        <template #title>Multsig Info</template>

        <template #body>
          <TableInfoView :data="accountMultisig" />
        </template>
      </Card>

      <Card v-if="1||showMultiSigDeatail" class="card-f card-adaptive" :loading="loading">
        <!-- MultiSig Cosignatories -->
        <template #title>Multsig Cosignatories</template>

        <template #body>
          <TableListView :data="accountMultisigCosignatories" />
        </template>

      </Card>

      <Card v-if="1||showMosaics" class="card-f card-adaptive" :loading="loading">
        <!-- Mosaics -->
        <template #title>Owned Mosaics</template>

        <template #body>
          <TableListView :data="mosaicList" />
        </template>
      </Card>

      <Card v-if="1||showNamespaces" class="card-f card-adaptive" :loading="loading">
        <!-- NS -->
        <template #title>Owned Namespaces</template>

        <template #body>
          <TableListView :data="namespaceList" />
        </template>
      </Card>

      <Card v-if="1||showTransactions" class="card-f card-full-width" :loading="loading">
        <!-- Transactions -->
        <template #title>Transactions</template>
        <template #control>
          <DropDown
            :value="selectedTransactionType"
            :options="transactionTypes"
            @change="changeTransactionType"
          />
        </template>

        <template #body>
          <TableListView :data="filteredTransactionList" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  mounted() {
    this.$store.dispatch('account/fetchAccountDataByAddress', this.address)
  },

  data() {
    return {
      transactionTypes: [
        { name: 'All transactions', value: 1 },
        { name: 'Mosaic transactions', value: 2 },
        { name: 'Namespace transactions', value: 3 },
        { name: 'Transfers', value: 4 }
      ],
      selectedTransactionType: 1 // TODO: store.getters
    }
  },

  computed: {
    ...mapGetters({
      accountInfo: 'account/accountInfo',
      accountMultisig: 'account/accountMultisig',
      accountMultisigCosignatories: 'account/accountMultisigCosignatories',
      namespaceList: 'account/namespaceList',
      mosaicList: 'account/mosaicList',
      transactionList: 'account/transactionList',
      loading: 'account/accountInfoLoading',
      error: 'account/accountInfoError'
    }),

    address() {
      return this.$route.params.address || 0
    },

    showDeatail() {
      return !this.error && this.accountInfo
    },
    showMultiSigDeatail() {
      return !this.error && this.accountMultisigCosignatories?.length
    },
    showMosaics() {
      return !this.error && this.mosaicList?.length
    },
    showNamespaces() {
      return !this.error && this.namespaceList?.length
    },
    showTransactions() {
      return !this.error
    },

    filteredTransactionList() {
      if (Array.isArray(this.transactionList)) {
        switch (this.selectedTransactionType) {
          case 1:
            return this.transactionList
          case 2:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType?.toUpperCase().indexOf('MOSAIC') !==
                -1
            )
          case 3:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf('NAMESPACE') !== -1
            )
          case 4:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf('TRANSFER') !== -1
            )
        }
      }
      return undefined
    }
  },

  methods: {
    changeTransactionType(v) {
      this.selectedTransactionType = v
      // this.$store.dispatch("account/getTransactions", {
      //     transactionType: this.selectedTransactionType
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
