<template>
    <b-container fluid>
        <b-row>
            <!-- Account Detail -->
            <Card
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="accountInfo" />
                </template>

                <template #error>
                    Account {{address}} does not exist
                </template>
            </Card>

            <!-- MultiSig Cosignatories -->
            <Card
                xs="3"
                md="12"
                :loading="loading"
            >
                <template #title>
                    {{cosignatoriesTitle}}
                </template>

                <template #body>
                    <TableListView :data="accountMultisigCosignatories" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Mosaics -->
            <Card
                xs="12"
                md="3"
                :loading="loading"
            >
                <template #title>
                    {{mosaicsTitle}}
                </template>

                <template #body>
                    <TableListView :data="mosaicList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Namespaces -->
            <Card
                xs="12"
                md="3"
                :loading="loading"
            >
                <template #title>
                    {{namespacesTitle}}
                </template>

                <template #body>
                    <TableListView :data="namespaceList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Importance History -->
            <Card
                :loading="loading"
            >
                <template #title>
                    {{importanceHistory}}
                </template>

                <template #body>
                    <TableListView :data="activityBucketList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Transactions -->
            <Card
                :loading="loading"
            >
                <template #title>
                    {{transactionsTitle}}
                </template>

                <template #control>
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>

                <template #body>
                    <TableListView :data="filteredTransactionList" :pagination="true" :pageSize="5"/>
                </template>
            </Card>
        </b-row>
    </b-container>
</template>

<script>
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  data() {
    return {
      detailTitle: "Account Detail",
      importanceHistory: "Importance History",
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
