<template>
  <div class="page">
    <div class="page-content-card-f">
      <!-- Account Detail -->
      <Card class="card-f card-full-width" :loading="loading" :error="error">
        <template #title>
          {{ detailTitle }}
        </template>

        <template #body>
          <TableInfoView :data="accountInfo" />
        </template>

        <template #error> Account {{ address }} does not exist </template>
      </Card>

      <Card class="card-f card-full-width" :loading="loading">
        <!-- Activity -->
        <template #title>
          {{ activityBuckets }}
        </template>

        <template #body>
          <TableListView :data="activityBucketList" />
        </template>
      </Card>

      <!-- MultiSig Cosignatories -->
      <Card class="card-f card-adaptive" :loading="loading">
        <template #title>
          {{ cosignatoriesTitle }}
        </template>

        <template #body>
          <TableListView :data="accountMultisigCosignatories" />
        </template>
      </Card>

      <!-- Mosaics -->
      <Card class="card-f card-adaptive" :loading="loading">
        <template #title>
          {{ mosaicsTitle }}
        </template>

        <template #body>
          <TableListView :data="mosaicList" />
        </template>
      </Card>

      <!-- Namespaces -->
      <Card class="card-f card-adaptive" :loading="loading">
        <template #title>
          {{ namespacesTitle }}
        </template>

        <template #body>
          <TableListView :data="namespaceList" />
        </template>
      </Card>

      <!-- Transactions -->
      <Card class="card-f card-full-width" :loading="loading">
        <template #title>
          {{ transactionsTitle }}
        </template>

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
import View from "./View.vue";
import helper from "../helper";
import { mapGetters } from "vuex";

export default {
  extends: View,

  async mounted() {
    await helper.logError(this.$store.dispatch, "api/initialize");
    await helper.logError(
      this.$store.dispatch,
      "account/fetchAccountDataByAddress",
      this.address
    );
  },

  data() {
    return {
      detailTitle: "Account Detail",
      activityBuckets: "Activity Buckets",
      cosignatoriesTitle: "Multisig Cosignatories",
      mosaicsTitle: "Owned Mosaics",
      namespacesTitle: "Owned Namespaces",
      transactionsTitle: "Transactions",
      transactionTypes: [
        { name: "All transactions", value: 1 },
        { name: "Mosaic transactions", value: 2 },
        { name: "Namespace transactions", value: 3 },
        { name: "Transfers", value: 4 }
      ],
      selectedTransactionType: 1 // TODO: store.getters
    };
  },

  computed: {
    ...mapGetters({
      accountInfo: "account/getAccountInfo",
      accountMultisig: "account/getAccountMultisig",
      accountMultisigCosignatories: "account/getAccountMultisigCosignatories",
      namespaceList: "account/getNamespaceList",
      mosaicList: "account/getMosaicList",
      transactionList: "account/getTransactionList",
      activityBucketList: "account/getActivityBucketList",
      loading: "account/accountInfoLoading",
      error: "account/accountInfoError"
    }),

    address() {
      return this.$route.params.address || 0;
    },

    showDeatail() {
      return !this.error && this.accountInfo;
    },
    showMultiSigDeatail() {
      return !this.error && this.accountMultisigCosignatories?.length;
    },
    showMosaics() {
      return !this.error && this.mosaicList?.length;
    },
    showNamespaces() {
      return !this.error && this.namespaceList?.length;
    },
    showActivityBucketList() {
      return !this.error && this.activityBucketList?.length;
    },
    showTransactions() {
      return !this.error;
    },

    filteredTransactionList() {
      if (Array.isArray(this.transactionList)) {
        switch (this.selectedTransactionType) {
          case 1:
            return this.transactionList;
          case 2:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType?.toUpperCase().indexOf("MOSAIC") !==
                -1
            );
          case 3:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf("NAMESPACE") !== -1
            );
          case 4:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf("TRANSFER") !== -1
            );
        }
      }
      return undefined;
    }
  },

  methods: {
    changeTransactionType(v) {
      this.selectedTransactionType = v;
      // this.$store.dispatch("account/getTransactions", {
      //     transactionType: this.selectedTransactionType
      // });
    }
  }
};
</script>

<style lang="scss" scoped></style>
